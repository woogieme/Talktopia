// getToken.js
import { messaging } from './firebaseConfig';
import { getToken } from 'firebase/messaging';
import {vapidKey} from '../../../utils';

async function getFCMToken() {
  try {
    const token = await getToken(messaging, { vapidKey: `${vapidKey}`});
    if (token) {
      console.log("FCM token:", token);
      return token;
    } else {
      console.log('No Instance ID token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    throw error;
  }
}

export default getFCMToken;