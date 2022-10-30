import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Quiz, QuizAnswer } from '../../../interfaces/quiz';

interface PropsInterface {
    answers: QuizAnswer[];
    item: Quiz;
    showAnswers: boolean;
    onAnswer: (answer: string, number: number) => void;
}

const MultipleChoice = (props: PropsInterface) => {
    const { answers, item, showAnswers, onAnswer } = props;
    const { number } = item;

    let choices = item.choices;

    // check if odd numbered choices
    if (choices.length % 2) {
        // if odd add a placeholder
        choices.push('');
    }

    return (
        <View>
            <Text>Choices: </Text>
            <View className="flex-row flex-wrap gap-2 mt-2 justify-center">
                {choices.map((choice, index) => {
                    const answer = answers.find(
                        (answer) => answer.number === number,
                    );

                    const isSelected = answer?.answer === choice;
                    const isSelectedWrong =
                        showAnswers &&
                        isSelected &&
                        answer?.answer !== item.answer;
                    const isChoiceCorrectAnswer =
                        showAnswers && choice === item.answer;

                    return (
                        <TouchableOpacity
                            disabled={showAnswers || !choice}
                            key={`${choice}_${index}`}
                            className={`border p-2 rounded-xl w-[45%] ${
                                isSelected && !showAnswers && 'bg-slate-300'
                            } ${isSelectedWrong && 'bg-red-300'} ${
                                isChoiceCorrectAnswer && 'bg-green-300'
                            }`}
                            onPress={() => onAnswer(choice, number)}
                        >
                            <Text
                                className={`${
                                    isSelected && showAnswers && 'text-white'
                                }`}
                            >
                                {choice}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default MultipleChoice;
