import React from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

const usePushNotification = () => {
  // const requestUserPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     //Request iOS permission
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   } else if (Platform.OS === 'android') {
  //     //Request Android permission (For API level 33+, for 32 or below is not required)
  //     const res = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );
  //   }
  // }

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
    });
    return unsubscribe;
  }

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  }

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if(message) {
      console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
    }
  };

  const sendNotification = async (title, body) => {
    console.log('Failed to send notification: No FCM token available');
    // try {
    //   const fcmToken = await getFCMToken();
    //   if (fcmToken) {
    //     await messaging().send({
    //       notification: {
    //         title: title,
    //         body: body,
    //       },
    //       token: fcmToken,
    //       // Add actions for inline reply
    //       actions: [
    //         {
    //           action: 'reply',
    //           title: 'Reply',
    //           input: true,
    //         },
    //       ],
    //     });
    //   } else {
    //     console.log('Failed to send notification: No FCM token available');
    //   }
    // } catch (error) {
    //   console.error('Error sending notification:', error);
    // }
  };

  // Other functions remain unchanged

  return {
    // requestUserPermission,
    getFCMToken,
    sendNotification,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
    // Other functions
  };

};

export default usePushNotification;
