const admin = require('firebase-admin');
const serviceAccount = require('../../service_acc/kitty-bee02-firebase-adminsdk-hbomy-4258fc176b.json');
const FcmModel = require("../../src/schema/FcmSchema");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// async function sendPushNotifications({ title, message, userId,image,type,objectId  }) {
//     console.log(type,objectId,'otttt')
//     try {
//         const userTokensDoc = await FcmModel.find({
//             userId,
//             deviceType: 'Android',
//         });

//         // console.log(userTokensDoc, 'Tokens for the user');
//         const defaultImageUrl = 'https://example.com/default-image.jpg';

//         // Use the provided image if available, otherwise fallback to the default image
//         const imageUrl = image ? image : defaultImageUrl;
//         const userTokens = userTokensDoc
//             .flatMap((fcm) => fcm?.fcmToken) // Flatten nested arrays of fcmToken
//             .filter((token) => token && token.trim() !== ''); // Skip empty or invalid tokens
//             console.log(userTokens,'ustttttttt');

//         const payload = {
//             notification: {
//                 title: title,
//                 body: message,
//                 image: imageUrl, // Optional image URL if needed
//             },
//             data: {
//                 route: '/invitation',
//                 title: title,
//                 body: message,
//                 image: imageUrl, // Optional image URL if needed
//                 type:type,
//                 id:objectId?.toString()

//             },
//         };

//         const options = {
//             priority: "high",
//         };

//         console.log(payload,'ppppppppp');


//         // Send notifications using Promise.allSettled
//         const responses = await Promise.allSettled(
//             userTokens.map((token) =>
//                 admin.messaging().send({
//                     token: token,
//                     notification: payload.notification,
//                     data: payload.data,
//                     android: {
//                         priority: options.priority,
//                     },
//                 })
//             )
//         );

//         // Separate successful and failed notifications
//         const successfulNotifications = responses.filter((r) => r.status === 'fulfilled');
//         const failedNotifications = responses.filter((r) => r.status === 'rejected');

//         // console.log('Successful Notifications:', successfulNotifications.length);
//         // console.log('Failed Notifications:', failedNotifications.length);

//         // Optionally, log failed tokens for further processing or cleanup
//         if (failedNotifications.length > 0) {
//             const failedTokens = failedNotifications.map((r, index) => ({
//                 token: userTokens[index],
//                 reason: r.reason,
//             }));
//             // console.error('Failed Tokens:', failedTokens);
//         }

//         return {
//             successCount: successfulNotifications.length,
//             failureCount: failedNotifications.length,
//         };
//     } catch (error) {
//         console.error('Error sending push notification:', error);
//         throw error;
//     }
// }

async function sendPushNotifications({ title, message, userId, image, type, objectId }) {
    console.log(title, message, userId, image, type, objectId,"fffff")
    try {
        const userTokensDoc = await FcmModel.find({
            userId,
            deviceType: 'Android',
        });

        const defaultImageUrl = 'https://example.com/default-image.jpg';
        const imageUrl = image || defaultImageUrl;

        const userTokens = userTokensDoc
            .flatMap(fcm => fcm?.fcmToken || [])
            .filter(token => token && token.trim() !== '');

        if (userTokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        const route = getRouteForType(type);

        const payload = {
            notification: {
                title,
                body: message,
                image: imageUrl,
            },
            data: {
                route,
                title,
                body: message,
                image: imageUrl,
                type: type || '',
                id: objectId?.toString() || '',
            },
        };

        const responses = await Promise.allSettled(
            userTokens.map(token =>
                admin.messaging().send({
                    token,
                    notification: payload.notification,
                    data: payload.data,
                    android: {
                        priority: "high",
                    },
                })
            )
        );

        const successful = responses.filter(r => r.status === 'fulfilled');
        const failed = responses.filter(r => r.status === 'rejected');

        if (failed.length > 0) {
            const failedTokens = failed.map((r, index) => ({
                token: userTokens[index],
                reason: r.reason,
            }));
            console.warn('Failed tokens:', failedTokens);
        }

        return {
            successCount: successful.length,
            failureCount: failed.length,
        };
    } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
}

function getRouteForType(type) {
    switch (type) {
        case 'kitty':
        case 'kitty-join-request':
            return '/invitation';
        case 'group':
        case 'group-join-request':
            return '/GroupDetailsscreen';
        case 'post':
            return '/FourmComments';
        default:
            return '/unknown';
    }
}


async function sendPushNotificationsCreateMessage({ title, message, responseData, userTokens }) {
console.log(responseData,"responseDataresponseData");

    try {
        // Filter out invalid or empty tokens

        const validTokens = userTokens?.filter(token => token) || [];

        if (validTokens.length === 0) {
            console.log('No valid FCM tokens available for sending notifications.');
            return { message: 'No valid tokens found. No notifications sent.' };
        }
        const sanitizedResponseData = {};
        if (responseData && typeof responseData === 'object') {
            for (const [key, value] of Object.entries(responseData)) {
                sanitizedResponseData[key] = typeof value === 'string' ? value : JSON.stringify(value);
            }
        }
        
        const payload = {
            notification: {
                title: title,
                body: message,
                image: 'your_image_url', // Optional: replace with actual image URL if needed
            },
            data: {
                route: 'your_route', // Adjust to the route you need to pass
                title: title,
                body: message,
                ...sanitizedResponseData,
            },
        };

        const options = {
            android: {
                priority: "high",
            },
        };

        // Send notifications to all valid tokens
        const responses = await Promise.allSettled(
            validTokens.map(token =>
                admin.messaging().send({
                    token: token,
                    notification: payload.notification,
                    data: payload.data,
                    android: options.android,
                })
            )
        );

        // Log results for sent notifications
        const successfulNotifications = responses.filter(r => r.status === 'fulfilled');
        const failedNotifications = responses.filter(r => r.status === 'rejected');

        console.log(`Successfully sent notifications: ${successfulNotifications.length}`);
        if (failedNotifications.length > 0) {
            console.warn(`Failed to send notifications: ${failedNotifications.length}`);
        }

        return {
            successCount: successfulNotifications.length,
            failureCount: failedNotifications.length,
        };
    } catch (error) {
        console.error('Error sending push notifications:', error.message);
        throw error;
    }
}



async function sendPostCreatedNotifications({ title, message, postId, userIds }) {
    try {
        console.log(title, message, postId, userIds,'dssssssssssssssssssss')

        // Fetch FCM tokens for the specified users who use Android devices
        const userTokensDocs = await FcmModel.find({
            userId: { $in: userIds },
            deviceType: 'Android',
        });

        // const userTokens = userTokensDocs.map((fcm) => fcm.fcmToken);
        const userTokens = userTokensDocs
    .flatMap((fcm) => fcm?.fcmToken) // Flatten nested arrays of fcmToken
    .filter((token) => token && token.trim() !== ''); // Skip empty or invalid tokens


        if (userTokens.length === 0) {
            console.warn('No tokens found for the specified users.');
            return;
        }

        const payload = {
            notification: {
                title: title,
                body: message,
                image: 'your_image_url', // Optional image URL
            },
            data: {
                route: 'post_details',
                postId: postId.toString(), // Convert to string as required
                title: title,
                body: message,
            },
        };

        const options = {
            priority: 'high',
        };

        const responses = await Promise.allSettled(
            userTokens.map(token =>
                admin.messaging().send({
                    token: token,
                    notification: payload.notification,
                    data: payload.data,
                    android: { priority: options.priority },
                })
            )
        );

        // Remove invalid tokens from the database
      

        console.log('Push notifications sent successfully:', responses);
        return responses;
    } catch (error) {
        console.error('Error sending post creation notifications:', error);
        throw error;
    }
}



module.exports = { sendPushNotifications,sendPushNotificationsCreateMessage ,sendPostCreatedNotifications};
