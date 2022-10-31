import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';
import { useState } from 'react';
import { RootStackParamList } from './types/routes.type';
import { User } from 'firebase/auth';
import QuizList from './screens/QuizList/QuizList';
import FlashcardsList from './screens/FlashcardsList/FlashcardsList';
import UserContext from './context/UserContext';
import Quiz from './screens/Quiz/Quiz';
import CreateQuiz from './screens/CreateQuiz/CreateQuiz';
import CreateFlashcards from './screens/CreateFlashcards/CreateFlashcards';
import Flashcards from './screens/Flashcards/Flashcards';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isUpEmail, setIsUpEmail] = useState<boolean>(false);

    return (
        <UserContext.Provider
            value={{ user, setUser, isUpEmail, setIsUpEmail }}
        >
            <View className="flex-1">
                <StatusBar />
                <NavigationContainer>
                    <Navigator>
                        <Screen name="Home" component={Home} />
                        <Screen name="Login" component={Login} />
                        <Screen name="CreateQuiz" component={CreateQuiz} />
                        <Screen name="Quiz" component={Quiz} />
                        <Screen name="QuizList" component={QuizList} />
                        <Screen
                            name="CreateFlashcard"
                            component={CreateFlashcards}
                        />
                        <Screen name="Flashcard" component={Flashcards} />
                        <Screen
                            name="FlashcardList"
                            component={FlashcardsList}
                        />
                    </Navigator>
                </NavigationContainer>
            </View>
        </UserContext.Provider>
    );
}
