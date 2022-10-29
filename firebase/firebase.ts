import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: 'AIzaSyDQI8eRPu5yQd8Q4OQwug17EYVEEhTOdV4',
    authDomain: 'uprev-ca0a7.firebaseapp.com',
    projectId: 'uprev-ca0a7',
    storageBucket: 'uprev-ca0a7.appspot.com',
    messagingSenderId: '737445873573',
    appId: '1:737445873573:web:d9cff4a80b2c807b4dca4c',
    measurementId: 'G-R7532KC5J5',
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

export default app;
