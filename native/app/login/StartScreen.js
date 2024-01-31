import React, { useEffect } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import PushNotification from './../screens/PushNotification'
import { useUserStore } from '../hooks/zustand/useUserStore'

export default function StartScreen({ navigation }) {
  const { user, getUser} = useUserStore();
  console.log("USER",user)
  useEffect(()=> {
    getUser(1)
  },[])
  return (
    <Background>
      <Logo />
      <Header color = "white">Login Template</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
      <PushNotification />
    </Background>
  )
}