import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>

        {/* Header section */}
        <View className="flex-1 justify-center px-6">
          {/* Logo/Branding */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gradient-to-br ☐ from-blue-600
        to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Ionicons name="fitness" size={40} color="white"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              FitTracker
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Track your fitness journey{'\n'}and reach your goals
            </Text>
          </View>


          {/* Sign in form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Welcome Back!
            </Text>
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 text-sm mb-2 font-medium">Email Address</Text>
                <TextInput
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-gray-700 text-sm mb-2 font-medium">Password</Text>
                <TextInput
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  value={password}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>


            </View>
          </View>


          <TouchableOpacity
            onPress={onSignInPress}
            className="w-full bg-blue-600 py-3 rounded-lg mt-2"
          >
            <Text className="text-white font-semibold text-center">Sign In</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <GoogleSignIn />
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/sign-up">
              <Text className="text-blue-600 font-medium">Sign up</Text>
            </Link>
          </View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}