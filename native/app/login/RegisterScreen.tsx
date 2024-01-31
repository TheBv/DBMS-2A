import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import SelectMultiple from 'react-native-select-multiple'
import { putUser } from '../lib/api'
import { usePushToken } from '../hooks/usePushToken'
import { useUserStore } from '../hooks/zustand/useUserStore'
import { getInnerToken } from '../lib/util'

type Category = 'soccer' | 'basketball' | 'tennis' | 'volleyball' | 'handball' | 'rugby' | 'hockey' | 'baseball' | 'american_football' | 'badminton' | 'table_tennis'

const allCategories: Category[] = ['soccer', 'basketball', 'tennis', 'volleyball', 'handball', 'rugby', 'hockey', 'baseball', 'american_football', 'badminton', 'table_tennis']

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [categories, setCategories] = useState<{ value: Category[], error: string }>({ value: [], error: '' })

  const { getUser } = useUserStore()
  const { token } = usePushToken()

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    const response = await putUser({
      name: name.value,
      email: email.value,
      password: password.value,
      categories: categories.value,
      token: getInnerToken(token)
    }).catch((error) => {
      console.log(error)
      return
    })
    if (!response)
      return
    await getUser(response[0].id)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Homepage' }],
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        description={"Your name"}
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        description={"A valid email address"}
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        description={"The password"}
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <SelectMultiple
        style={{ maxHeight: '10%' }}
        label="Categories"
        onSelectionsChange={(value) => setCategories({ ...categories, value: value.map((item) => item.value) })}
        selectedItems={categories.value}
        items={allCategories}
      />


      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})