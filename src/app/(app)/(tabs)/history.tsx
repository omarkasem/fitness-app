import { client } from "@/lib/client";
import { Workout } from "@/lib/sanity.types";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { formatDuration } from "lib/utils";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const getWorkoutsQuery = defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
  _id,
  date,
  duration,
  exercises[]{
    exercise->{
      _id,
      name,
    },
    sets[]{
      _id,
      reps,
      weight,
      weightUnit,
      _type,
      _key
    },
    _type,
    _key
  }
}`)

export default function historyPage() {
  const { user } = useUser()
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useLocalSearchParams();
  const router = useRouter();

  const fetchWorkouts = async () => {
    if (!user?.id) return

    try {
      const results = await client.fetch(getWorkoutsQuery, { userId: user.id })

      console.log(results[0].exercises)
      setWorkouts(results)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [user?.id])

  useEffect(() => {
    if (refresh.refresh) {
      fetchWorkouts()
      router.replace("(app)/(tabs)/history")
    }
  }, [refresh.refresh])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWorkouts()
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatWorkoutDuration = (duration: number) => {
    if (!duration) return 'Duration not recorded'
    return formatDuration(duration)
  }

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((acc, exercise) => {
      return acc + exercise.sets.length
    }, 0)
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="text-lg font-semibold mt-4 text-sky-600">Loading your workouts...</Text>
        <Text className="text-sm text-gray-500 mt-1">Get ready to see your progress!</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}

      <View className="px-6 py-4">
        <View className="p-4">
          <Text className="text-2xl font-bold">Workout History</Text>
          <Text className="text-gray-600 mt-1">
            {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} completed
          </Text>
        </View>
      </View>


      {/* Workouts List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View className="p-2 items-center justify-center ">
            <Ionicons name="barbell-outline" size={64} color="#9ca3af" />
            <Text className="text-xl font-semibold text-gray-600 mt-4">
              No workouts yet
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              Your completed workouts will appear here
            </Text>
          </View>
        ) : (
          <TouchableOpacity className="px-4">
            {workouts.map((workout) => (
              <View
                key={workout._id}
                className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              >
                <Text className="text-gray-600 mt-1">
                  {formatDate(workout.date)}
                </Text>
                <Text className="text-gray-500 mt-1">
                  {formatWorkoutDuration(workout.duration)}
                </Text>


                {/* Workout Stats */}
                <View className="flex-row gap-2 mt-3">
                  <View className="bg-blue-50 px-3 py-1.5 rounded-full">
                    <Text className="text-blue-700 text-xs font-semibold">
                      {workout.exercises.length} EXERCISES
                    </Text>
                  </View>
                  <View className="bg-purple-50 px-3 py-1.5 rounded-full">
                    <Text className="text-purple-700 text-xs font-semibold">
                      {getTotalSets(workout)} SETS
                    </Text>
                  </View>
                </View>


                {/* Exercises List */}
                <View className="mt-4">
                  <Text className="text-gray-700 text-lg font-semibold mb-2">
                    Exercises
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {workout.exercises.map((exercise, index) => (
                      <View key={index} className="bg-green-50 px-3 py-1.5 rounded-full">
                        <Text className="text-green-700 text-md font-semibold">
                          {exercise.exercise.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>


              </View>


            ))}
          </TouchableOpacity>
        )}
      </ScrollView>


    </SafeAreaView>
  );
}
