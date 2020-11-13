import { Expo } from 'expo-server-sdk';
import { onlineUsers } from '../../services/chat';

let expo = new Expo();

let messages = [];

class NotificationController {
    requestSend(notification, userID) {
        const { expoToken, message, title } = notification;

        messages.push({
            to: expoToken,
            sound: 'default',
            body: message,
            title,
            user: userID,
        });
    }

    async sendChunk() {
        if (messages[0]) {
            console.log(messages);
            const chunks = expo.chunkPushNotifications(messages);

            try {
                await chunks.forEach(async (chunk) => {
                    const index = onlineUsers.findIndex(
                        (item) => item == chunk[0].user
                    );
                    console.log(index);
                    if (index < 0) {
                        await expo.sendPushNotificationsAsync(chunk);
                    }
                });
                messages = [];
            } catch (err) {
                console.log(err);
            }
        }
    }
}

export default new NotificationController();
