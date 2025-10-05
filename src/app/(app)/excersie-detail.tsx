import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image, Linking, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Exercise } from '@/lib/sanity.types'
import { defineQuery } from 'groq'
import { client, urlFor } from '@/lib/client'

const singelExerciseQuery = defineQuery(`*[_type == "exercise" && _id == $id][0]`)

export default function ExercieDetail() {

    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { id } = useLocalSearchParams<string>()

    const getAiGuidance = async () => {
        console.log('getAiGuidance')
    }


    useEffect(() => {
        const fetchExercise = async () => {
            if (!id) return
            try {
                setLoading(true)
                const exercise = await client.fetch(singelExerciseQuery, { id })
                setExercise(exercise)
                console.log(exercise)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchExercise()
    }, [id])

    if (loading) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50'>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <StatusBar barStyle="light-content" />

            <View className="flex-row items-center px-4 py-2 bg-white">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2"
                >
                    <Ionicons name="close-outline" size={32} color="#374151" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
                {exercise?.image && (
                    <Image
                        source={{ uri: urlFor(exercise.image?.asset?._ref).url() }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />
                )}

                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900">
                        {exercise?.name}
                    </Text>

                    {exercise?.difficulty && (
                        <View className={`mt-2 self-start px-3 py-1 rounded-full ${exercise.difficulty?.toLowerCase() === 'beginner' ? 'bg-green-100' :
                            exercise.difficulty?.toLowerCase() === 'intermediate' ? 'bg-yellow-100' :
                                exercise.difficulty?.toLowerCase() === 'advanced' ? 'bg-red-100' :
                                    'bg-gray-100'
                            }`}>
                            <Text className={`text-sm font-medium ${exercise.difficulty?.toLowerCase() === 'beginner' ? 'text-green-800' :
                                exercise.difficulty?.toLowerCase() === 'intermediate' ? 'text-yellow-800' :
                                    exercise.difficulty?.toLowerCase() === 'advanced' ? 'text-red-800' :
                                        'text-gray-800'
                                }`}>
                                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                            </Text>
                        </View>
                    )}

                    {exercise?.description && (
                        <Text className="mt-4 text-base text-gray-600 leading-relaxed">
                            {exercise.description}
                        </Text>
                    )}

                    {exercise?.videoUrl && (
                        <View className="mt-8">
                            <Text className="text-xl font-semibold text-gray-900 mb-4">
                                Video Tutorial
                            </Text>

                            <TouchableOpacity
                                className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video"
                                onPress={() => Linking.openURL(exercise.videoUrl)}
                            >
                                <Image
                                    source={{ uri: `https://img.youtube.com/vi/${exercise.videoUrl.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg` }}
                                    className="absolute inset-0 w-full h-full"
                                    resizeMode="cover"
                                />
                                <View className="absolute inset-0 items-center justify-center">
                                    <View className="w-16 h-16 bg-white/90 rounded-full items-center justify-center">
                                        <Ionicons name="play" size={32} color="#374151" />
                                    </View>
                                </View>
                                <Text className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                                    Watch Tutorial
                                </Text>
                                <Text className="absolute bottom-4 right-4 text-white text-sm">
                                    Learn proper form
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}


                    <View className="mt-8">
                        <TouchableOpacity
                            className="bg-indigo-600 rounded-xl py-4 px-6 flex-row items-center justify-center mb-4"
                            onPress={getAiGuidance}
                        >
                            <Ionicons name="bulb-outline" size={24} color="#ffffff" className="mr-2" />
                            <Text className="text-white font-semibold text-lg">
                                Get AI Form & Technique Guidance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-200 rounded-xl py-4 px-6 flex-row items-center justify-center"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="close-outline" size={24} color="#374151" className="mr-2" />
                            <Text className="text-gray-800 font-medium text-lg">
                                Close Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>

            </ScrollView>

        </SafeAreaView>
    )
}