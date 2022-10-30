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
                multiline
                className={`p-2 border rounded-xl w-full lg:w-1/2 ${
                    showAnswers && isAnswerCorrect && 'bg-green-300 text-white'
                } ${
                    showAnswers && !isAnswerCorrect && 'bg-red-300 text-white'
                }`}
                editable={!showAnswers}
                placeholder="Enter answer"
                value={textValue}
                onChangeText={(text) => onAnswer(text, number)}
            />
            {showAnswers && !isAnswerCorrect && (
                <>
                    <Text className="text-sm mt-2">Correct answer:</Text>
                    <TextInput
                        editable={false}
                        className="w-full p-2 border outline-none text-black"
                        value={item.answer}
                    />
                </>
            )}
        </View>
    );
};

export default Identification;
