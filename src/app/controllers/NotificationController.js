import { Expo } from 'expo-server-sdk';

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
            const chunks = Expo.chunkPushNotifications(messages);

            try {
                await chunks.forEach(async (chunk) => {
                    await Expo.sendPushNotificationsAsync(chunk);
                });
                messages = [];
            } catch (err) {
                console.log(err);
            }
        }
    }
}

export default new NotificationController();
