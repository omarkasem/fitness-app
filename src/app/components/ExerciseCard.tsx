import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Exercise } from '@/lib/sanity.types'
import { urlFor } from '@/lib/client'
import { Image } from 'react-native'

interface ExerciseCardProps {
    item: Exercise,
    onPress: () => void,
    showChevron?: boolean
}


const getDifficultyColor = (difficulty: string) => {

    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return 'text-green-800'
        case 'intermediate':
            return 'text-yellow-800'
        case 'advanced':
            return 'text-red-800'
        default:
            return 'text-gray-800'
    }
}



export default function ExerciseCard({ item, onPress, showChevron = false }: ExerciseCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm border border-gray-100"
        >
            <View className="flex-row">
                {/* Exercise Image */}
                <View className="w-24 h-24 rounded-lg overflow-hidden mr-4">
                    {item.image && (
                        <Image
                            source={{ uri: urlFor(item.image?.asset?._ref).url() }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    )}
                </View>

                {/* Exercise Details */}
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                        {item.name}
                    </Text>

                    {item.description && (
                        <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}

                    <View className="flex-row items-center mt-2">
                        {item.difficulty && (
                            <View className={`px-3 py-1 rounded-full ${item.difficulty?.toLowerCase() === 'beginner' ? 'bg-green-100' :
                                item.difficulty?.toLowerCase() === 'intermediate' ? 'bg-yellow-100' :
                                    item.difficulty?.toLowerCase() === 'advanced' ? 'bg-red-100' :
                                        'bg-gray-100'
                                }`}>
                                <Text className={`text-sm font-medium ${getDifficultyColor(item.difficulty.toLowerCase())}`}>
                                    {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}