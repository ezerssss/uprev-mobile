import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';
import { createContext, useState } from 'react';
import { RootStackParamList } from './types/routes.type';
import { User } from 'firebase/auth';
import QuizList from './screens/QuizList/QuizList';
import FlashcardsList from './screens/FlashcardsList/FlashcardsList';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
    isUpEmail: boolean;
    setIsUpEmail: React.Dispatch<React.SetStateAction<boolean>> | null;
}>({ user: null, setUser: null, isUpEmail: false, setIsUpEmail: null });

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
                        <Screen name="Quiz" component={QuizList} />
                        <Screen name="Flashcard" component={FlashcardsList} />
                    </Navigator>
                </NavigationContainer>
            </View>
        </UserContext.Provider>
    );
}
