import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import {
    ChevronLeftIcon,
    Cog8ToothIcon,
    XMarkIcon,
} from 'react-native-heroicons/outline';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/routes.type';
import auth from '../firebase/auth';
import { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import SettingsModal from './SettingsModal';
import { Dialog } from 'react-native-alert-notification';

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

    function handleCloseModal() {
        setIsModalOpen(false);
        Dialog.hide();
    }

    return (
        <View className="flex-row justify-between items-center p-4 lg:px-40 bg-white">
            <ReactNativeModal
                className="flex-1 bg-white rounded-xl"
                isVisible={isModalOpen}
            >
                <ScrollView
                    className="rounded-xl"
                    contentContainerStyle={{
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 50,
                        paddingBottom: 30,
                    }}
                >
                    <TouchableOpacity
                        className="absolute top-5 right-5"
                        onPress={() => setIsModalOpen(false)}
                    >
                        <XMarkIcon color="black" />
                    </TouchableOpacity>
                    <SettingsModal onCloseModal={handleCloseModal} />
                </ScrollView>
            </ReactNativeModal>
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
            <View className="flex-row gap-6 items-center">
                <View className="flex-row">
                    <TouchableOpacity className="mr-5" onPress={handleBack}>
                        <ChevronLeftIcon color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalOpen(true)}>
                        <Cog8ToothIcon color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Navbar;
