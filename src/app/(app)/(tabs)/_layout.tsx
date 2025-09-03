import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false, title: 'Home', tabBarIcon: ({ color, size }) => <AntDesign name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="exercises" options={{ headerShown: false, title: 'Exercises', tabBarIcon: ({ color, size }) => <AntDesign name="book" color={color} size={size} /> }} />

      <Tabs.Screen name="workout" options={{ headerShown: false, title: 'Workout', tabBarIcon: ({ color, size }) => <AntDesign name="pluscircle" color={color} size={size} /> }} />

      <Tabs.Screen name="active-workout" options={{ headerShown: false,href:null, title: 'Active Workout', tabBarIcon: ({ color, size }) => <AntDesign name="calendar" color={color} size={size} /> }} />

      <Tabs.Screen name="history" options={{ headerShown: false, title: 'History', tabBarIcon: ({ color, size }) => <AntDesign name="calendar" color={color} size={size} /> }} />

      <Tabs.Screen name="profile" options={{ headerShown: false, title: 'Profile', tabBarIcon: ({ color, size }) => <AntDesign name="user" color={color} size={size} /> }} />

    </Tabs>
  )
}