import React, { useEffect } from "react";
import usePushNotification from './src/hooks/usePushNotification';

const PushController = () => {
  const { listenToForegroundNotifications } = usePushNotification();

  useEffect(() => {
    const unsubscribeForeground = listenToForegroundNotifications();
    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
    };
  }, [listenToForegroundNotifications]);

  return null;
};

export default PushController;
