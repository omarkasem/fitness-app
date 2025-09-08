import { View, Text, SafeAreaView, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { defineQuery } from 'groq'
import { client } from '@/lib/client'
import ExerciseCard from '@/app/components/ExerciseCard'
export const exercisesQuery = defineQuery(`*[_type == "exercise"]`)

export default function exercises() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const router = useRouter()
  const [refreshing, setRefreshing] = React.useState(false)
  const [exercises, setExercises] = React.useState([])
  const [filteredExercises, setFilteredExercises] = React.useState([])

  React.useEffect(() => {
    fetchExercises()
  }, [])

  // Filter exercises based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises)
    } else {
      const filtered = exercises.filter((exercise: any) =>
        exercise.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredExercises(filtered)
    }
  }, [searchQuery, exercises])

  const fetchExercises = async () => {
    try {
      setRefreshing(true)
      const exercises = await client.fetch(exercisesQuery)
      setExercises(exercises)
      setFilteredExercises(exercises)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await fetchExercises()
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className="px-4 pt-4">
        <Text className="text-3xl font-bold text-gray-900">Exercise Library</Text>
        <Text className="text-base text-gray-600 mt-1 mb-4">
          Discover and master new exercises
        </Text>

        <View className="flex-row items-center bg-white rounded-lg px-4 py-2 shadow-sm">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 text-base text-gray-900 flex-1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Exercises List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/excersie-detail?id=${item._id}`)}
          />
        )}
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg mt-4">No exercises found</Text>
            <Text className="text-gray-500 text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Pull down to refresh'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}