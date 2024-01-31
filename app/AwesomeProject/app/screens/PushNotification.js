import React from 'react';
import { Button } from 'react-native';
import usePushNotification from './app/hooks/usePushNotification';

const MyComponent = () => {
  const { sendNotification } = usePushNotification();

  const handleSendNotification = () => {
    sendNotification('Test 2', 'Test 1');
  };

  return (
    <Button title="Benachrichtigung senden" onPress={handleSendNotification} />
  );
};

export default MyComponent;
