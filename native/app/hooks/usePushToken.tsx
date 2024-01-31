import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useUserStore } from './zustand/useUserStore';

export const usePushToken = () => {
  const { token, setToken } = useUserStore();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  Notifications.setNotificationCategoryAsync('example', [
    {
      identifier: 'one',
      buttonTitle: 'Button One',
      options: {
        isDestructive: true,
        isAuthenticationRequired: false
      }
    },
    {
      identifier: 'two',
      buttonTitle: 'Button Two',
      options: {
        isDestructive: true,
        isAuthenticationRequired: true
      }
    },
    {
      identifier: 'three',
      buttonTitle: 'Three',
      textInput: { submitButtonTitle: 'Three', placeholder: 'Type Something' },
    },
  ])

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();


  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
        categoryIdentifier: 'example'
      },
      trigger: { seconds: 2 },
    });
  }
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Button pressed
      console.log(response);
    });
  }, []);

  useEffect(() => {
    // If there is already the token in the app state - no need to re fetch it
    if (token) return;

    registerForPushNotificationsAsync().then((token) => {
      setToken(token);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [token, setToken]);

  return { token, notification, registerForPushNotificationsAsync, schedulePushNotification };

}
