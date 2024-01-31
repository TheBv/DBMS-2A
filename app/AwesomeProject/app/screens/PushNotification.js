import React from 'react';
import { Button } from 'react-native';
import usePushNotification from '../hooks/usePushNotification';

const PushNotification = () => {
  const { sendNotification } = usePushNotification();

  const handleSendNotification = () => {
    sendNotification('Test 2', 'Test 1');
  };

  return (
    <Button title="Send Notification" onPress={handleSendNotification} />
  );
};

export default PushNotification;
