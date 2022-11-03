import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { RootStackParamList } from '../../types/routes.type';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
    FirebaseQuiz,
    FirebaseQuizAnswers,
    SnapshotFirebaseQuiz,
    SnapshotFirebaseQuizWithScores,
} from '../../interfaces/quiz';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import db from '../../firebase/db';
import Quiz from './components/Quiz';
import UserContext from '../../context/UserContext';
import { errorAlert } from '../../helpers/errors';

const QuizList = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'QuizList'>) => {
    const { subject } = route.params;
    const { user } = useContext(UserContext);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleFlashcards() {
        navigation.navigate('FlashcardList', { subject });
    }

    const [quizzes, setQuizzes] = useState<SnapshotFirebaseQuizWithScores[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const quizzesRef = collection(db, 'subjects', subject, 'quizzes');
        const q = query(quizzesRef);

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            try {
                const snapshotArray: SnapshotFirebaseQuizWithScores[] = [];
                for (const document of querySnapshot.docs) {
                    const quizWithId: SnapshotFirebaseQuiz = {
                        id: document.id,
                        ...(document.data() as FirebaseQuiz),
                    };
                    const uid = user?.uid || 'lost';
                    const scoreRef = doc(
                        db,
                        'users',
                        uid,
                        'subjects',
                        subject,
                        'scores',
                        document.id,
                    );
                    const scoreSnapshot = await getDoc(scoreRef);
                    const scoreData =
                        scoreSnapshot.data() as FirebaseQuizAnswers | null;

                    const object: SnapshotFirebaseQuizWithScores = {
                        ...quizWithId,
                        userScore: scoreData,
                    };

                    snapshotArray.push(object);
                }

                setQuizzes(snapshotArray);
                setIsLoading(false);
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [subject, user?.uid]);

    function handleEdit(id: string) {
        navigation.navigate('CreateQuiz', { subject, id, isEditing: true });
    }

    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(db, 'subjects', subject, 'quizzes', id));
        } catch (error) {
            errorAlert(error);
        }
    }

    function handleClick(id: string) {
        navigation.navigate('Quiz', { subject, id });
    }

    const renderLoading = isLoading && (
        <View className="flex-row justify-center">
            <ActivityIndicator color="black" size="large" />
        </View>
    );

    const renderNoQuizzes = !isLoading && !quizzes.length && (
        <Text>No Quizzes</Text>
    );

    return (
        <AuthWrapper>
            <ContentWrapper>
                <Text className="mt-5 mb-3 text-4xl">
                    <Text className="font-bold">{subject.toUpperCase()}</Text>{' '}
                    Quizzes
                </Text>
                <TouchableOpacity
                    className="border rounded-xl p-2 w-24 mb-5 border-gray-300"
                    onPress={handleFlashcards}
                >
                    <Text className="text-center">Flashcards</Text>
                </TouchableOpacity>
                <>
                    {renderLoading}
                    {renderNoQuizzes}
                    {quizzes.map((quiz) => (
                        <Quiz
                            key={quiz.id}
                            quiz={quiz}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onClick={handleClick}
                        />
                    ))}
                </>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default QuizList;
