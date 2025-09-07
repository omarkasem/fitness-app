import React from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";


export default function Page() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => signOut()
        }
      ]
    );
  }
  return (
    <SafeAreaView className="flex flex-1">
      <Text>Profile</Text>

      <TouchableOpacity
        onPress={handleSignOut}
        className="mx-4 mt-4 bg-red-500 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
