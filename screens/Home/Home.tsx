import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Image,
    useWindowDimensions,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import {
    CodeBracketIcon,
    ListBulletIcon,
    PencilIcon,
} from 'react-native-heroicons/outline';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import { RootStackParamList } from '../../types/routes.type';

function Home() {
    const { height } = useWindowDimensions();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleSubjectClick(subject: string) {
        navigation.navigate('QuizList', { subject });
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
                    {['math 18', 'cmsc 11', 'cmsc 56'].map((subject, index) => (
                        <TouchableOpacity
                            disabled={!subject}
                            key={`${subject},${index}`}
                            className="flex-1 max-w-[31%] aspect-square border rounded-2xl flex justify-center items-center"
                            onPress={() => handleSubjectClick(subject)}
                        >
                            <View>
                                <Text>{subject.toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row gap-2 mt-2 max-w-[500] m-auto justify-center">
                    {['cmsc 10', '', ''].map((subject, index) => (
                        <TouchableOpacity
                            disabled={!subject}
                            key={`${subject},${index}`}
                            className="flex-1 max-w-[31%] aspect-square border rounded-2xl flex justify-center items-center"
                            onPress={() => handleSubjectClick(subject)}
                        >
                            <View>
                                <Text>{subject.toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="mt-16 mb-10">
                    <Text className="text-center">
                        Want to help your fellow students?
                    </Text>
                    <Text className="text-center">Post your own</Text>
                    <View className="flex-row gap-2 items-center justify-center mt-3">
                        <TouchableOpacity className="rounded-xl p-4 border">
                            <Text className="text-center font-bold">
                                Flashcard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="rounded-xl p-4 border"
                            onPress={handleCreateQuiz}
                        >
                            <Text className="text-center font-bold">Quiz</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center justify-center gap-4 mt-1">
                        <ListBulletIcon color="black" />
                        <PencilIcon color="black" />
                        <CodeBracketIcon color="black" />
                    </View>
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
}

export default Home;
