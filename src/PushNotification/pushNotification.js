const admin = require('firebase-admin');
const serviceAccount = require('../../service_acc/kitty-bee02-firebase-adminsdk-hbomy-4258fc176b.json');
const FcmModel = require("../schema/fcmSchema"); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function sendPushNotifications({ title, message, userId }) {
    try {
        const userTokensDoc = await FcmModel.find({
            userId,
            devicetype: 'mobile',
        });

        const userTokens = userTokensDoc.map((fcm) => fcm.token);

        if (userTokens.length === 0) {
            throw new Error('No tokens found for the user');
        }

        const payload = {
            notification: {
                title: title,
                body: message,
                sound: 'default',
                icon: 'ic_launcher',
                color: '#ff5e3a',
                click_action: 'FCM_PLUGIN_ACTIVITY',
                badge: '1',
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

        const result = await admin.messaging().sendToDevice(userTokens, payload, options);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = { sendPushNotifications };
