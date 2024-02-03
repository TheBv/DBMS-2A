import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useUserStore } from './zustand/useUserStore';
import { getUsers, putAnswer } from '../lib/api';
import { getInnerToken } from '../lib/util';
import { useNavigation } from '@react-navigation/native';

export const usePushToken = () => {
  const { user, token, setToken, getUser } = useUserStore();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  if (Platform.OS != 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    Notifications.setNotificationCategoryAsync('question', [
      {
        identifier: '1',
        buttonTitle: 'Poor',
        options: {
          isDestructive: true,
          isAuthenticationRequired: false
        }
      },
      {
        identifier: '3',
        buttonTitle: 'Acceptable',
        options: {
          isDestructive: true,
          isAuthenticationRequired: false
        }
      },
      {
        identifier: '5',
        buttonTitle: 'Excellent',
        options: {
          isDestructive: true,
          isAuthenticationRequired: false
        }
      }
    ])
  }
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();


  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Example notification",
        body: 'Here is an example notification',
        data: { data: 'goes here' },
        categoryIdentifier: 'question'
      },
      trigger: { seconds: 1 },
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
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  const navigate = useNavigation();

  useEffect(() => {
    // Ideally we would only register them once but oh well
    if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current)
    //Notifications.removeNotificationSubscription(notificationListener.current)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notificationResponse => {
      // FIXME: This can be done way better
      // Default action identifeir
      if (notificationResponse.actionIdentifier == Notifications.DEFAULT_ACTION_IDENTIFIER) {
        // Naviagte to the question screen
        navigate.navigate("Quiz", { index: notificationResponse.notification.request.content.data.question_id })
        return
      }

      getUsers({ token: getInnerToken(token) }).then((users) => {
        if (users.length != 0)
          getUser(users[0].id).then((user) => {
            putAnswer({ user_id: user.id, question_id: notificationResponse.notification.request.content.data.question_id, answer: notificationResponse.actionIdentifier, timestamp: new Date().getTime() }).then((response) => {
              if (!response)
                navigate.navigate("Quiz", { index: notificationResponse.notification.request.content.data.question_id })
              Notifications.dismissNotificationAsync(notificationResponse.notification.request.identifier)
            })
          })
      })
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
