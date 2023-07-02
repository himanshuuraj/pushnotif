// const express = require('express');
// const firebase = require('firebase/app');
// require('firebase/database');
// const firestore = require('firebase/firestore');
// const app = express();
// const PORT = 3000;

// const firebaseConfig = {
//     apiKey: "AIzaSyDGujzrdjwGvcq2FbsdEUV4t_-MYhL9dfQ",
//     authDomain: "binimise-v1.firebaseapp.com",
//     databaseURL: "https://binimise-v1.firebaseio.com",
//     projectId: "binimise-v1",
//     storageBucket: "binimise-v1.appspot.com",
//     messagingSenderId: "149629247619",
//     appId: "1:149629247619:web:c26ab6066e1acf07933bb68",
//     measurementId: "G-H51MQTTTHS"
// }

// firebase.initializeApp(firebaseConfig);
// // let fireStore = firebase.fireStore();
// const munAraFirestore = firestore.collection("mun").doc("jagdalpur");

// app.use(express.json());

// const getVehicleSummaryRef = () => {
//     return munAraFirestore.collection("vehicle_summary");
// }

// app.post('/post', async (req, res)=>{
//     const {name} = req.body;

//     let arr = []
//     let data = await getVehicleSummaryRef().get(); 
//     data.docs.map((item)=>{
//         let d = item.data();
//         let obj={"id": d.id, ...d}
//         arr.push(obj);
//     })
      
//     res.send({ arr: arr });
// })

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';

import express from 'express';
import axios from "axios";


const app = express();
const PORT = 3000;

const firebaseConfig = {
    apiKey: "AIzaSyDGujzrdjwGvcq2FbsdEUV4t_-MYhL9dfQ",
    authDomain: "binimise-v1.firebaseapp.com",
    databaseURL: "https://binimise-v1.firebaseio.com",
    projectId: "binimise-v1",
    storageBucket: "binimise-v1.appspot.com",
    messagingSenderId: "149629247619",
    appId: "1:149629247619:web:c26ab6066e1acf07933bb68",
    measurementId: "G-H51MQTTTHS"
}

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const munAraFirestore = collection(firestore, 'mun');

app.get("/sendAlarm", (req, res) => {
  sendNotif("alarm");
  res.send({});
})

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Example route
app.get('/insertNotReachedData', async (req, res) => {
  // Access the Firestore collection
  let documentId = generateRandomString();
  let newData = {
    "cluster": {
      "clusterId": "cluster1",
      "clusterName": "cluster1",
      "time": {
        "endTime": "8:00",
        "startTime": "7:00"
      }
    },
    "message": "The ward1-cluster1 is not attended by the vehicle Agendra Nag(7587215760)",
    "saathis": [
      {
        saathiId: "ab3946adb2894f498a8ce23c1f5029e7",
        saathiName: "Punya saathi",
        phoneNumber: "7892331817",
        tokenId: "0618ecd1-8e21-46c7-ad8b-cbb53c31c5d0"
      }
    ],
    "type": "VehicleNotReached",
    "time": new Date().toLocaleTimeString().replace(" ", "").replace("AM", "").replace("PM", ""),
    "vehicles": [
      {
        vehicleName: "Agendra Nag",
        vehicleId: "CG17H3417 / 34"
      }
    ]
  }

  const docRef = doc(firestore, 'mun', 'jagdalpur', "vehicle_summary_notif", "03-07-2023", "alerts", generateRandomString(5));
  await setDoc(docRef, newData);

  res.send('Data stored successfully!');
  sendNotif("vehicleNotReached");
  
});

app.get('/insertNotCoveredData', async (req, res) => {
  // Access the Firestore collection
  let documentId = generateRandomString();
  let newData = {
    "cluster": {
      "clusterId": "cluster1",
      "clusterName": "cluster1",
      "time": {
        "endTime": "8:00",
        "startTime": "7:00"
      }
    },
    "message": "Vehicle Agendra Nag(7587215760) unable to complete 70% of entire path in the cluster ward1-cluster1 by time 08:00",
    "saathis": [
      {
        saathiId: "ab3946adb2894f498a8ce23c1f5029e7",
        saathiName: "Punya saathi",
        phoneNumber: "7892331817",
        tokenId: "0618ecd1-8e21-46c7-ad8b-cbb53c31c5d0"
      }
    ],
    "type": "clusterNotServed",
    "percentageServed": "20",
    "time": new Date().toLocaleTimeString().replace(" ", "").replace("AM", "").replace("PM", ""),
    "vehicles": [
      {
        vehicleName: "Agendra Nag",
        vehicleId: "CG17H3417 / 34"
      }
    ]
  }

  const docRef = doc(firestore, 'mun', 'jagdalpur', "vehicle_summary_notif", "03-07-2023", "alerts", generateRandomString(5));
  await setDoc(docRef, newData);

  res.send('Data stored successfully!');
  sendNotif("vehicleNotReached");
  
});

app.get('/citizenNotif', async (req, res) => {

  res.send('Data stored successfully!');
  var data = JSON.stringify({
    "app_id": "b87bb736-ff08-4e3d-be15-577443893be3",
    "contents": {"en": "Your garbage pickup vehicle is arriving soon"},
    "include_player_ids": ["b0e8ae00-5cd6-4cff-ab99-a27b3e7cefbf"],
    "android_sound": "notif",
    "existing_android_channel_id": "alertNotif"
});

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://onesignal.com/api/v1/notifications',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
  
});

function sendNotif(msg) {

    let message = ""
    if(msg == "alarm") {
      message = "Please set DUTYON for the assigned duty hours."
    } else if (msg == "vehicleNotReached") {
      message = "The ward1-cluster1 is not attended by the vehicle Agendra Nag(7587215760)"
    } else {
      message = "Vehicle Agendra Nag(7587215760) unable to complete 70% of entire path in the cluster ward1-cluster1 by time 08:00"
    }
   
    var data = JSON.stringify({
      "app_id": "c3957b64-dbd6-4f8d-aaea-46d7aad6f3b8",
      "contents": {
        "en": message
      },
      "include_player_ids": [
        "0618ecd1-8e21-46c7-ad8b-cbb53c31c5d0"
      ],
      "android_sound": "notif",
      "existing_android_channel_id": "alertNotif"
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://onesignal.com/api/v1/notifications',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

}


app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running, and App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
);
