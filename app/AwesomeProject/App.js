import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './app/screens/Welcome';
import QuizPage from './app/screens/QuizPage';
import Result from './app/screens/Result';
import TapRatingScreen from './app/screens/TapRatingScreen';
import StartScreen from './app/login/StartScreen';
import LoginScreen from './app/login/LoginScreen';
import RegisterScreen from './app/login/RegisterScreen';
import ResetPasswordScreen from './app/login/ResetPasswordScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="Homepage"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizPage}
          options={{
            title: 'Questions',
            headerStyle: {
              backgroundColor: '#fac782',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="TapRating" component={TapRatingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
