import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
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
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import db from '../../firebase/db';
import Flashcard from './components/Flashcard';
import UserContext from '../../context/UserContext';
import { errorAlert } from '../../helpers/errors';

const FlashcardsList = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'FlashcardList'>) => {
    const { subject } = route.params;
    const { user } = useContext(UserContext);

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleQuizzes() {
        navigation.navigate('QuizList', { subject });
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
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [subject, user?.uid]);

    function handleEdit(id: string) {
        navigation.navigate('CreateFlashcard', {
            subject,
            id,
            isEditing: true,
        });
    }

    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(db, 'subjects', subject, 'flashcards', id));
        } catch (error) {
            errorAlert(error);
        }
    }

    function handleFlashcardClick(id: string) {
        navigation.navigate('Flashcard', { subject, id });
    }

    const renderLoading = isLoading && (
        <View className="flex-row justify-center">
            <ActivityIndicator color="black" size="large" />
        </View>
    );

    const renderNoFlashcards = !isLoading && !flashcards.length && (
        <Text>No Flashcards</Text>
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
                        <Flashcard
                            key={flashcard.id}
                            flashcard={flashcard}
                            onClick={handleFlashcardClick}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default FlashcardsList;
