import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

interface PushNotificationModule {
  send: (title: string, body: string) => Promise<void>;
}

const usePushNotification = () => {
  const requestUserPermission = async () => {
    // Your permission request code
  };

  const getFCMToken = async () => {
    // Your FCM token retrieval code
  };

  const sendNotification = async (title: string, body: string) => {
    try {
      const fcmToken = await getFCMToken(); // Get the FCM token
      if (fcmToken) {
        // Send the notification via FCM
        await messaging().send({
          // Set notification payload
          notification: {
            title: title, // Custom title
            body: body, // Custom body
          },
          // Set device token
          token: fcmToken,
          // For iOS only
          priority: 'high',
          contentAvailable: true,
          mutableContent: true,
        });
      } else {
        console.log('Failed to send notification: No FCM token available');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Other functions remain unchanged

  return {
    requestUserPermission,
    getFCMToken,
    sendNotification,
    // Other functions
  };
};

export default usePushNotification as () => PushNotificationModule;
