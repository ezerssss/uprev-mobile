import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/routes.type';
import { useNavigation } from '@react-navigation/native';
import {
    FlashcardInterface,
    SnapshotFlashcard,
} from '../../interfaces/flashcards';
import { collection, onSnapshot, query } from 'firebase/firestore';
import db from '../../firebase/db';
import Flashcard from './components/Flashcard';
import UserContext from '../../context/UserContext';

const FlashcardsList = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'Flashcard'>) => {
    const { subject } = route.params;
    const { user } = useContext(UserContext);

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleQuizzes() {
        navigation.navigate('Quiz', { subject });
    }

    const [flashcards, setFlashcards] = useState<SnapshotFlashcard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const flashcardsRef = collection(db, 'subjects', subject, 'flashcards');
        const q = query(flashcardsRef);

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            try {
                const snapshotArray: SnapshotFlashcard[] = [];
                querySnapshot.forEach((card) => {
                    const data = card.data() as FlashcardInterface;
                    const object: SnapshotFlashcard = {
                        id: card.id,
                        ...data,
                    };

                    snapshotArray.push(object);
                });

                setFlashcards(snapshotArray);
                setIsLoading(false);
            } catch (error: any) {
                Alert.alert(
                    'Something went wrong',
                    `${error.msg}. Please contact Ezra Magbanua`,
                    [{ text: 'OK' }],
                );
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [subject, user?.uid]);

    const renderLoading = isLoading && (
        <View className="flex-row justify-center">
            <Text>Loading...</Text>
        </View>
    );

    const renderNoFlashcards = !isLoading && !flashcards.length && (
        <Text>No Quizzes</Text>
    );

    return (
        <AuthWrapper>
            <ContentWrapper>
                <Text className="mt-5 mb-3 text-4xl">
                    <Text className="font-bold">{subject.toUpperCase()}</Text>{' '}
                    Flashcards
                </Text>
                <TouchableOpacity
                    className="border rounded-xl p-2 w-20 border-gray-300 mb-5"
                    onPress={handleQuizzes}
                >
                    <Text className="text-center">Quizzes</Text>
                </TouchableOpacity>
                <>
                    {renderLoading}
                    {renderNoFlashcards}
                    {flashcards.map((flashcard) => (
                        <Flashcard key={flashcard.id} flashcard={flashcard} />
                    ))}
                </>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default FlashcardsList;
