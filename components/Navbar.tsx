import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from 'react-native-heroicons/outline';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/routes.type';
import auth from '../firebase/auth';

const Navbar = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    async function handleLogout() {
        await auth.signOut();
        navigation.navigate('Login');
    }

    function handleBack() {
        navigation.goBack();
    }

    function handleHome() {
        navigation.navigate('Home');
    }

    return (
        <View className="flex-row justify-between items-center p-4 lg:px-40 bg-white">
            <TouchableOpacity onPress={handleHome}>
                <View className="flex-row gap-1 items-center">
                    <Image
                        className="h-6 w-6"
                        source={require('../assets/images/logo.png')}
                    />
                    <Text className="text-2xl font-bold tracking-wide">
                        uprev.
                    </Text>
                </View>
            </TouchableOpacity>
            <View className="flex-row gap-1 items-center">
                <TouchableOpacity onPress={handleBack}>
                    <ChevronLeftIcon color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <ChevronRightIcon color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Navbar;
