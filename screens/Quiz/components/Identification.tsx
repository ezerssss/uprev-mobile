import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { Quiz, QuizAnswer } from '../../../interfaces/quiz';

interface PropsInterface {
    answers: QuizAnswer[];
    item: Quiz;
    showAnswers: boolean;
    onAnswer: (text: string, number: number) => void;
}

const Identification = (props: PropsInterface) => {
    const { answers, item, showAnswers, onAnswer } = props;
    const { number } = item;
    const textValue =
        answers.find((answer) => answer.number === number)?.answer || '';

    const isAnswerCorrect = textValue === item.answer;

    return (
        <View className="relative">
            <TextInput
                className={`px-2 border-b ${
                    showAnswers && isAnswerCorrect && 'bg-green-500 text-white'
                } ${
                    showAnswers && !isAnswerCorrect && 'bg-red-500 text-white'
                }`}
                editable={!showAnswers}
                multiline={true}
                placeholder="Enter answer"
                value={textValue}
                onChangeText={(text) => onAnswer(text, number)}
            />
        </View>
    );
};

export default Identification;
