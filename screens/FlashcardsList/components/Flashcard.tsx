import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { SnapshotFlashcard } from '../../../interfaces/flashcards';
import UserContext from '../../../context/UserContext';

interface PropsInterface {
    flashcard: SnapshotFlashcard;
    onClick: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const Flashcard = (props: PropsInterface) => {
    const { flashcard, onClick, onEdit, onDelete } = props;
    const { title, creator, email, id } = flashcard;
    const { user } = useContext(UserContext);

    const areButtonsVisible = email === user?.email;

    return (
        <TouchableOpacity
            className="border p-5 rounded-xl border-gray-300 my-2"
            onPress={() => onClick(id)}
        >
            <Text className="text-lg font-bold">{title}</Text>
            <Text className="my-3 text-[12px]">
                By: {creator} | {email}
            </Text>
            <>
                {areButtonsVisible && (
                    <View className="flex-row gap-2 mt-1">
                        <TouchableOpacity
                            className="border p-2 rounded-xl px-4 border-gray-400 bg-green-500"
                            onPress={() => onEdit(id)}
                        >
                            <Text className="text-white">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="border p-2 rounded-xl px-4 border-gray-400 bg-red-500"
                            onPress={() => onDelete(id)}
                        >
                            <Text className="text-white">Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </>
        </TouchableOpacity>
    );
};

export default Flashcard;
