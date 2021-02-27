import firebase from 'firebase/app';
require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDcThAA2FHiKdIdDLhISPJt3zqhiJ_EPFs',
  authDomain: 'veterinary-765f3.firebaseapp.com',
  projectId: 'veterinary-765f3',
  storageBucket: 'veterinary-765f3.appspot.com',
  messagingSenderId: '155942661596',
  appId: '1:155942661596:web:ebe9deb28f1087979ab319'
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);