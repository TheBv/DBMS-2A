import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Button from '../components/Button'
import { useUserStore } from "../hooks/zustand/useUserStore";
import { usePushToken } from "../hooks/usePushToken";
import { getUsers } from '../lib/api'
import { getInnerToken } from '../lib/util'

const Welcome = ({ navigation }) => {
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));
  const [progress, setProgress] = useState(new Animated.Value(0));
  const {getUser} = useUserStore();
  const { token} = usePushToken();
  
  // Crumy way to make sure we properly have set our current user
  useEffect(()=> {
    if (!token)
      return
    getUsers({token: getInnerToken(token)}).then((users)=> {
      if (users.length != 0)
        getUser(users[0].id)
    })
  },[token])

  const { setUser } = useUserStore()

  const startQuiz = () => {

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1900,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.timing(progress, {
      toValue: 0 + 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/welcome.png")} />
      <View style={styles.subContainer}>
        <Text style={styles.text}>The only place success comes before work is in the dictionary</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Quiz");
          startQuiz();
          mode = "contained"
        }}
        style={styles.btn}
      >
        <Text style={styles.btnText}>Let's Begin</Text>
      </TouchableOpacity>
      <Button
        mode="outlined"
        onPress={() => {
          setUser(null)
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }}
      >
        Logout
      </Button>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38588b",
    alignItem: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItem: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
  btn: {
    // backgroundColor: "#d5bf96",
    backgroundColor: "#f13a59",
    paddingHorizontal: 5,
    paddingVertical: 15,
    // width: "50%",
    position: "relative",
    borderRadius: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  btnText: {
    fontSize: 20,
    textAlign: "center",
    color: "#ffffff",
    letterSpacing: 1.1,
  },
});
export default Welcome;