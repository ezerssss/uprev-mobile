import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CardsInterface } from '../../../interfaces/flashcards';

interface PropsInterface {
    card: CardsInterface;
    onEdit: (text: string, number: number, key: string) => void;
    onDelete: (number: number) => void;
}

function Flashcard(props: PropsInterface) {
    const { card, onEdit, onDelete } = props;
    const { keyword, description, number } = card;

    return (
        <View className="border p-3 flex-1 min-h-[80px] text-sm rounded-3xl my-3">
            <View className="flex-row gap-2 my-4 items-center">
                <Text>Keyword: </Text>
                <TextInput
                    multiline
                    className="border rounded-xl p-2 flex-1 lg:flex-none lg:w-1/2"
                    placeholder="Enter Keyword"
                    value={keyword}
                    onChangeText={(text) => onEdit(text, number, 'keyword')}
                />
            </View>
            <View className="flex-row gap-2 mb-4">
                <Text>Description: </Text>
                <TextInput
                    multiline
                    className="border rounded-xl outline-none p-2 flex-1 h-28 min-h-[1.5rem] "
                    placeholder="Enter Description"
                    value={description}
                    onChangeText={(text) => onEdit(text, number, 'description')}
                />
            </View>
            <TouchableOpacity
                className="mt-4 mb-2 p-2 border rounded-xl w-20 bg-red-300"
                onPress={() => onDelete(number)}
            >
                <Text className="text-center">Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Flashcard;
