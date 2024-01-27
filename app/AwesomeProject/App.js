import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./app/screens/Welcome";
import QuizPage from "./app/screens/QuizPage";
import Result from "./app/screens/Result";
import TapRatingScreen from './app/screens/TapRatingScreen';
// import theme from './app/core';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './app/login'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Welcome"
      > */}
      <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
        <Stack.Screen
          name="Homepage"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizPage}
          options={{
            title: "Questions",
            headerStyle: {
              backgroundColor: "#fac782",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
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