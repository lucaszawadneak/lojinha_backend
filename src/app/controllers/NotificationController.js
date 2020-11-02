import { Expo } from 'expo-server-sdk';

let expo = new Expo();

let messages = [];

class NotificationController {
    requestSend(notification) {
        const { expoToken, message } = notification;

        messages.push({
            to: expoToken,
            sound: 'default',
            body: message,
        });
    }

    async sendChunk() {
        if (messages[0]) {
            console.log(messages);
            const chunks = expo.chunkPushNotifications(messages);

            try {
                await chunks.forEach(async (chunk) => {
                    await expo.sendPushNotificationsAsync(chunk);
                });
                messages = [];
            } catch (err) {
                console.log(err);
            }
        }
    }
}

export default new NotificationController();
