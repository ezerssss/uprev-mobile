import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import {
    Image,
    useWindowDimensions,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import ConfigContext from '../../context/ConfigContext';
import { RootStackParamList } from '../../types/routes.type';

function Home() {
    const { subjects } = useContext(ConfigContext);

    const { height } = useWindowDimensions();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleSubjectClick(subject: string) {
        navigation.navigate('QuizList', { subject });
    }

    function handleCreateFlashcards() {
        navigation.navigate('CreateFlashcard');
    }

    function handleCreateQuiz() {
        navigation.navigate('CreateQuiz');
    }

    return (
        <AuthWrapper>
            <ContentWrapper>
                <Image
                    className="m-auto w-full"
                    resizeMode="contain"
                    style={{ height: height * 0.3 }}
                    source={require('../../assets/images/corporate-image.png')}
                />
                <Text className="text-6xl font-bold my-5 text-center">
                    Let's review together.
                </Text>
                <View className="flex-row gap-2 max-w-[500] m-auto  justify-center">
                    {subjects.slice(0, 3).map((subject, index) => (
                        <TouchableOpacity
                            className="flex-1 max-w-[31%] aspect-square border rounded-2xl flex justify-center items-center"
                            disabled={!subject}
                            key={`${subject},${index}`}
                            onPress={() => handleSubjectClick(subject)}
                        >
                            <Text>{subject.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row gap-2 mt-2 max-w-[500] m-auto justify-center">
                    {subjects.slice(3, 6).map((subject, index) => (
                        <TouchableOpacity
                            disabled={!subject}
                            key={`${subject},${index}`}
                            className="flex-1 max-w-[31%] aspect-square border rounded-2xl flex justify-center items-center"
                            onPress={() => handleSubjectClick(subject)}
                        >
                            <Text>{subject.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="mt-8 mb-10">
                    <Text className="text-center font-bold text-lg">
                        Help others review! Make your own:
                    </Text>
                    <View className="flex-row gap-2 items-center justify-center mt-1">
                        <TouchableOpacity
                            className="rounded-xl p-4 border"
                            onPress={handleCreateQuiz}
                        >
                            <Text className="text-center font-bold">Quiz</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="rounded-xl p-4 border"
                            onPress={handleCreateFlashcards}
                        >
                            <Text className="text-center font-bold">
                                Flashcard
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
}

export default Home;
