import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/routes.type';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import { Picker } from '@react-native-picker/picker';
import UserContext from '../../context/UserContext';
import { FirebaseQuiz, Quiz } from '../../interfaces/quiz';
import { defaultQuestion } from '../../constants/question';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../firebase/db';
import { getHighestNumber } from '../../helpers/number';
import { errorAlert } from '../../helpers/errors';
import { QuestionType } from '../../types/question.types';
import { useNavigation } from '@react-navigation/native';
import Question from './Question';

const CreateQuiz = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'CreateQuiz'>) => {
    let isEditing = false;
    let id: undefined | string = undefined;
    let subject: undefined | string = undefined;
    if (route.params) {
        isEditing = route.params.isEditing;
        id = route.params.id;
        subject = route.params.subject;
    }

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { user, isUpEmail } = useContext(UserContext);
    const [number, setNumber] = useState<number>(1);
    const [questions, setQuestions] = useState<Quiz[]>([defaultQuestion]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [dropdownSelection, setDropdownSelection] =
        useState<string>('math 18');

    useEffect(() => {
        async function getFirestoreDocument() {
            if (!id) {
                return;
            }

            if (!subject) {
                return;
            }

            const docRef = doc(db, 'subjects', subject, 'quizzes', id);
            try {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data() as FirebaseQuiz;

                setDropdownSelection(subject);
                setNumber(getHighestNumber(data) + 1);
                setTitle(data.title);
                setQuestions(data.questions);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestoreDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, id]);

    function handleEditQuestion(
        text: string,
        number: number,
        key: string,
    ): void {
        const index = questions.findIndex((object) => object.number === number);

        if (index < 0) return;

        const question = questions[index] as Record<string, any>;
        question[key] = text;

        questions[index] = question as Quiz;

        setQuestions([...questions]);
    }

    function handleEditChoices(text: string, number: number, index: number) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.choices[index] = text;

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleAddChoices(number: number) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.choices.push('');

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleChangeQuestionType(number: number, type: QuestionType) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.type = type;

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleAddAnotherQuestion() {
        const question: Quiz = {
            type: 'multiple-choice',
            number: number,
            choices: ['', ''],
            question: '',
            answer: '',
        };

        setNumber(number + 1);
        setQuestions([...questions, question]);
    }

    async function handlePost(
        object: FirebaseQuiz,
        subject: string,
    ): Promise<string> {
        const doc = await addDoc(
            collection(db, 'subjects', subject, 'quizzes'),
            object,
        );

        return doc.id;
    }

    async function handleEdit(object: FirebaseQuiz) {
        if (!id) {
            console.error('No Id found');
            return;
        }

        if (!subject) {
            console.error('No subject found');
            return;
        }

        const docRef = doc(db, 'subjects', subject, 'quizzes', id);

        await updateDoc(docRef, { ...object });
    }

    function handleRedirectToQuiz(id?: string) {
        const subject = dropdownSelection;

        if (!id || !subject) return;

        navigation.navigate('Quiz', { subject, id });
    }

    async function handleSubmitButton() {
        setIsPosting(true);
        if (!isUpEmail) {
            Alert.alert('Oops.', 'To post a quiz, you must use your UP email', [
                { text: 'OK' },
            ]);
            setIsPosting(false);

            return;
        }

        const subject = dropdownSelection;
        const object: FirebaseQuiz = {
            creator: user?.displayName || '-',
            email: user?.email || '-',
            title,
            questions,
        };

        try {
            if (isEditing) {
                handleEdit(object);
            } else {
                id = await handlePost(object, subject);
            }

            setIsPosting(false);

            const popUpText = isEditing ? 'Quiz Edited' : 'Quiz Posted';

            Alert.alert(popUpText, 'Click "OK" to redirect to the quiz', [
                { text: 'OK', onPress: () => handleRedirectToQuiz(id) },
            ]);
        } catch (error) {
            errorAlert(error);
            setIsPosting(false);
        }
    }

    function handleDelete(number: number) {
        setQuestions(
            questions.filter((question) => question.number !== number),
        );
    }

    const postButtonText = isEditing ? 'Edit Quiz' : 'Post Quiz';

    const renderSubmitButton = isPosting ? (
        <Text className="text-sm">Loading...</Text>
    ) : (
        <Text>{postButtonText}</Text>
    );

    return (
        <AuthWrapper>
            <ContentWrapper>
                <View className="flex-row gap-2 items-center">
                    <Text className="text-lg">Subject: </Text>
                    <View className="border rounded-xl flex-1 lg:flex-none lg:w-[300]">
                        <Picker
                            selectedValue={dropdownSelection}
                            itemStyle={{
                                height: 100,
                                fontSize: 13.5,
                                width: 300,
                            }}
                            onValueChange={(value) =>
                                setDropdownSelection(value)
                            }
                        >
                            <Picker.Item label="MATH 18" value="math 18" />
                            <Picker.Item label="CMSC 10" value="cmsc 10" />
                            <Picker.Item label="CMSC 11" value="cmsc 11" />
                            <Picker.Item label="CMSC 56" value="cmsc 56" />
                        </Picker>
                    </View>
                </View>
                <View className="flex-row gap-2 my-5 items-center">
                    <Text className="text-lg">Title:</Text>
                    <TextInput
                        className="border rounded-xl p-2 flex-1 lg:flex-none lg:w-1/2"
                        placeholder="Enter Title"
                        onChangeText={(text) => setTitle(text)}
                    />
                </View>
                <View className="my-5">
                    {questions.map((question, index) => (
                        <Question
                            key={question.number}
                            questionNumber={index}
                            questionObject={question}
                            onEditQuestion={handleEditQuestion}
                            onEditChoices={handleEditChoices}
                            onAddChoices={handleAddChoices}
                            onChangeQuestionType={handleChangeQuestionType}
                            onDelete={handleDelete}
                        />
                    ))}
                </View>
                <View className="flex-row gap-2 justify-center items-center mb-5">
                    <TouchableOpacity
                        className="p-2 border rounded-xl"
                        onPress={handleAddAnotherQuestion}
                    >
                        <Text className="text-sm">Add another question</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-2 border rounded-xl"
                        onPress={handleSubmitButton}
                    >
                        {renderSubmitButton}
                    </TouchableOpacity>
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default CreateQuiz;
