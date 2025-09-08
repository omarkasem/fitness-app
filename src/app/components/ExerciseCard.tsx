import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ExerciseCardProps {
    item: {
        _id: string
        name: string
        description?: string
        targetMuscles?: string[]
        equipment?: string
    }
    onPress: () => void
}

export default function ExerciseCard({ item, onPress }: ExerciseCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm border border-gray-100"
        >
            <View>
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                </Text>
                {item.description && (
                    <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
                {item.targetMuscles && item.targetMuscles.length > 0 && (
                    <View className="flex-row flex-wrap">
                        {item.targetMuscles.slice(0, 3).map((muscle, index) => (
                            <View
                                key={index}
                                className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-1"
                            >
                                <Text className="text-xs text-blue-800 font-medium">
                                    {muscle}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}