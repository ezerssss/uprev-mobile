import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/routes.type';
import UserContext from '../../context/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebase/db';
import {
    FirebaseQuiz,
    FirebaseQuizAnswers,
    QuizAnswer,
} from '../../interfaces/quiz';
import { errorAlert } from '../../helpers/errors';
import { useNavigation } from '@react-navigation/native';
import Identification from './components/Identification';
import MultipleChoice from './components/MultipleChoice';

const Quiz = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'Quiz'>) => {
    const { subject, id } = route.params;
    const { user } = useContext(UserContext);

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [quiz, setQuiz] = useState<FirebaseQuiz | null>(null);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [showAnswers, setShowAnswers] = useState<boolean>(false);
    const [isAlreadyTaken, setIsAlreadyTaken] = useState<boolean>(false);

    useEffect(() => {
        async function getFirestore() {
            if (!user) return;
            const { uid } = user;

            try {
                const quizRef = doc(db, 'subjects', subject, 'quizzes', id);
                const scoreRef = doc(
                    db,
                    'users',
                    uid,
                    'subjects',
                    subject,
                    'scores',
                    id,
                );

                const quizSnapshot = await getDoc(quizRef);
                if (!quizSnapshot.exists()) {
                    throw Error(`Quiz not Found: ${id}`);
                }
                setQuiz(quizSnapshot.data() as FirebaseQuiz);

                const scoreSnapshot = await getDoc(scoreRef);
                if (scoreSnapshot.exists()) {
                    const scoreData =
                        scoreSnapshot.data() as FirebaseQuizAnswers;
                    setAnswers(scoreData.answers);
                    setIsAlreadyTaken(true);
                    setShowAnswers(true);
                }
            } catch (error) {
                errorAlert(error);
                return navigation.navigate('Home');
            }
        }

        getFirestore();
    }, [user, subject, id]);

    function handleIdentificationAnswer(text: string, number: number) {
        const itemIndex = answers.findIndex(
            (answer) => answer.number === number,
        );

        if (itemIndex < 0) {
            setAnswers([
                ...answers,
                {
                    number: number,
                    answer: text,
                },
            ]);

            return;
        }

        const answer = answers[itemIndex];
        answer.answer = text;

        answers[itemIndex] = answer;

        setAnswers([...answers]);
    }

    function handleMultipleChoiceAnswer(answer: string, number: number) {
        const itemIndex = answers.findIndex(
            (answer) => answer.number === number,
        );

        if (itemIndex < 0) {
            setAnswers([
                ...answers,
                {
                    number: number,
                    answer,
                },
            ]);

            return;
        }

        const answerFound = answers[itemIndex];
        answerFound.answer = answer;

        answers[itemIndex] = answerFound;

        setAnswers([...answers]);
    }

    const renderQuestions = quiz?.questions.map((item, index) => (
        <View key={item.number} className="mt-5">
            <View className="flex-row gap-1 mb-2">
                <Text className="text-[16px]">{index + 1}.</Text>
                <Text className="text-[16px] flex-1">{item.question}</Text>
            </View>
            {item.type === 'identification' ? (
                <Identification
                    answers={answers}
                    item={item}
                    showAnswers={showAnswers}
                    onAnswer={handleIdentificationAnswer}
                />
            ) : (
                <MultipleChoice
                    answers={answers}
                    item={item}
                    showAnswers={showAnswers}
                    onAnswer={handleMultipleChoiceAnswer}
                />
            )}
        </View>
    ));

    const showElements = !!quiz?.questions.length;

    return (
        <AuthWrapper>
            <ContentWrapper>
                <Text className="text-4xl font-bold mt-5">{quiz?.title}</Text>
                <>
                    {showElements && (
                        <Text className="text-[12px] my-2">
                            By: {quiz?.creator} | {quiz?.email}
                        </Text>
                    )}
                </>
                <>{renderQuestions}</>
                <View className="mt-8 mb-16">
                    {showElements && (
                        <TouchableOpacity
                            className="p-3 border bg-green-400 rounded-xl w-24"
                            disabled={!quiz?.questions.length || isAlreadyTaken}
                        >
                            <Text className="text-center">Finish Quiz</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default Quiz;
