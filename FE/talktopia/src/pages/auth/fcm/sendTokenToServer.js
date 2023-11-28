import axios from "axios";
import { BACKEND_URL } from "../../../utils";

// sendTokenToServer.js
async function sendTokenToServer(userId, token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        }

        const requestBody = {
            userId: userId,
            token: token
        };

        console.log(requestBody);
        const requestBodyJSON = JSON.stringify(requestBody);

        await axios.post(`${BACKEND_URL}/api/v1/fcm/saveFCM`, requestBodyJSON, { headers });

    } catch (error) {
        console.error('Failed to send token to server:', error);
        throw error;
    }
}

export default sendTokenToServer;
