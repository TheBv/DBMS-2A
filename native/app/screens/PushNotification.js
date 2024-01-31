
import { Button, View, Text } from 'react-native';
import { usePushToken } from '../hooks/usePushToken'

//import usePushNotification from '../hooks/usePushNotification';


const PushNotification = () => {
  const { notification, token, schedulePushNotification } = usePushToken()
  //console.log(token)
  console.log("NOTIFICATION", notification)
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {token}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button title="Send Notification" onPress={() => schedulePushNotification()} />
    </View>
  );
};




export default PushNotification;
