import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { Quiz } from '../../../interfaces/quiz';
import { QuestionType } from '../../../types/question.types';
import {
    ListBulletIcon,
    PencilIcon,
    PlusCircleIcon,
} from 'react-native-heroicons/outline';

interface PropsInterface {
    questionNumber: number;
    questionObject: Quiz;
    onEditQuestion: (e: string, number: number, key: string) => void;
    onEditChoices: (e: string, number: number, index: number) => void;
    onAddChoices: (number: number) => void;
    onChangeQuestionType: (number: number, type: QuestionType) => void;
    onDelete: (number: number) => void;
}

const Question = (props: PropsInterface) => {
    const {
        questionNumber,
        questionObject,
        onEditQuestion,
        onEditChoices,
        onAddChoices,
        onChangeQuestionType,
        onDelete,
    } = props;
    const { number, type, question, answer, choices } = questionObject;

    function handleQuestionType(questionType: QuestionType) {
        onChangeQuestionType(number, questionType);
    }

    const renderQuestionTypes = (
        <View className="flex-row">
            <TouchableOpacity
                className={`border-2 ${
                    type === 'multiple-choice'
                        ? 'border-gray-300'
                        : 'border-white'
                } p-2 rounded`}
                onPress={() => handleQuestionType('multiple-choice')}
            >
                <ListBulletIcon color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                className={`border-2 ${
                    type === 'identification'
                        ? 'border-gray-300'
                        : 'border-white'
                } p-2 rounded`}
                onPress={() => handleQuestionType('identification')}
            >
                <PencilIcon color="black" />
            </TouchableOpacity>
        </View>
    );

    const renderChoices = type === 'multiple-choice' && (
        <View className="mb-3">
            <Text>Choices:</Text>
            {choices.map((choice, index) => (
                <TextInput
                    multiline
                    key={`${number}_${index}`}
                    className="border rounded outline-none mt-2 p-2 w-full"
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChangeText={(text) => onEditChoices(text, number, index)}
                />
            ))}
            <TouchableOpacity
                className="flex-row items-center gap-1 mt-2 mb-5"
                onPress={() => onAddChoices(number)}
            >
                <PlusCircleIcon color="black" />
                <Text>Add another choice</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="border p-3 flex-1 min-h-[80px] text-sm rounded-3xl my-3">
            <TextInput
                multiline
                className="border outline-none p-2 w-full rounded-xl"
                placeholder={`Enter Question ${questionNumber}`}
                value={question}
                onChangeText={(text) =>
                    onEditQuestion(text, number, 'question')
                }
            />
            <View className="flex-row items-center gap-3 my-3">
                <Text>Type of Question:</Text>
                {renderQuestionTypes}
            </View>
            {renderChoices}
            <View>
                <Text>Correct Answer:</Text>
                <TextInput
                    multiline
                    className="border rounded outline-none p-2 w-full"
                    placeholder="Enter Answer"
                    value={answer}
                    onChangeText={(text) =>
                        onEditQuestion(text, number, 'answer')
                    }
                />
            </View>
            <TouchableOpacity
                className="mt-4 mb-2 p-2 border rounded-xl w-20"
                onPress={() => onDelete(questionNumber)}
            >
                <Text className="text-center">Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Question;
