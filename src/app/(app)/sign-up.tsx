import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import GoogleSignIn from '../components/GoogleSignIn'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View className="flex-1 justify-center px-6">
            {/* Logo/Branding */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="checkmark-circle" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Almost There!
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                Check your email for the{'\n'}verification code
              </Text>
            </View>

            {/* Verification form */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Verify Your Email
              </Text>
              <View>
                <Text className="text-gray-700 text-sm mb-2 font-medium">Verification Code</Text>
                <TextInput
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-center text-lg tracking-widest"
                  value={code}
                  placeholder="Enter 6-digit code"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={onVerifyPress}
              className="w-full bg-green-600 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">Verify Email</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600">Didn't receive the code? </Text>
              <TouchableOpacity onPress={onSignUpPress}>
                <Text className="text-green-600 font-medium">Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>

        {/* Header section */}
        <View className="flex-1 justify-center px-6">
          {/* Logo/Branding */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Join FitTracker
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Start your fitness journey{'\n'}today and achieve your goals
            </Text>
          </View>

          {/* Sign up form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Create Account
            </Text>
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 text-sm mb-2 font-medium">Email Address</Text>
                <TextInput
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  onChangeText={(email) => setEmailAddress(email)}
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-gray-700 text-sm mb-2 font-medium">Password</Text>
                <TextInput
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  value={password}
                  placeholder="Create a strong password"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
            className="w-full bg-green-600 py-3 rounded-lg mt-2"
          >
            <Text className="text-white font-semibold text-center">Create Account</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <GoogleSignIn />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-green-600 font-medium">Sign in</Text>
            </Link>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}