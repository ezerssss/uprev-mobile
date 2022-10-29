import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View } from 'react-native';
import Home from './screens/Home/Home';
import Login from './screens/Login/Login';

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
    return (
        <View className="flex-1 px-4">
            <StatusBar />
            <NavigationContainer>
                <Navigator>
                    <Screen name="Home" component={Home} />
                    <Screen name="Login" component={Login} />
                </Navigator>
            </NavigationContainer>
        </View>
    );
}
