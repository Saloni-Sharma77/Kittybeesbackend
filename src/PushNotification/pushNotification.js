const admin = require('firebase-admin');
const serviceAccount = require('../../service_acc/kitty-bee02-firebase-adminsdk-hbomy-4258fc176b.json');
const FcmModel = require("../../src/schema/FcmSchema");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function sendPushNotifications({ title, message, userId }) {
    try {
        const userTokensDoc = await FcmModel.find({
            userId,
            deviceType: 'Android',
        });

        console.log(userTokensDoc, 'Tokens for the user');

        const userTokens = userTokensDoc.map((fcm) => fcm.fcmToken);

        if (userTokens.length === 0) {
            throw new Error('No tokens found for the user');
        }

        const payload = {
            notification: {
                title: title,
                body: message,
                image: 'your_image_url', // Optional image URL if needed
            },
            data: {
                route: 'your_route', 
                title: title,
                body: message,
            },
        };

        const options = {
            priority: "high",
        };

        // Send notification to each token using the send method
        const response = await Promise.all(userTokens.map(token =>
            admin.messaging().send({
                token: token,
                notification: payload.notification,
                data: payload.data,
                android: {
                    priority: options.priority,
                },
            })
        ));

        console.log('FCM Response:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
}
async function sendPushNotificationsCreateMessage({ title, message, userId,responseData }) {
    try {
        const userTokensDoc = await FcmModel.find({
            userId,
            deviceType: 'Android',
        });

        console.log(userTokensDoc, 'Tokens for the user');

        const userTokens = userTokensDoc.map((fcm) => fcm.fcmToken);

        if (userTokens.length === 0) {
            throw new Error('No tokens found for the user');
        }

        const payload = {
            notification: {
                title: title,
                body: message,
                image: responseData?.image, // Optional image URL if needed
            },
            data: {
                route: 'your_route', 
                title: title,
                body: message,
            },
        };

        const options = {
            priority: "high",
        };

        // Send notification to each token using the send method
        const response = await Promise.all(userTokens.map(token =>
            admin.messaging().send({
                token: token,
                notification: payload.notification,
                data: payload.data,
                android: {
                    priority: options.priority,
                },
                fullData:responseData
            })
        ));

        console.log('FCM Response:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
}

module.exports = { sendPushNotifications,sendPushNotificationsCreateMessage };
