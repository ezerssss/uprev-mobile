import { useNavigation } from '@react-navigation/native';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLayoutEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import auth from '../../firebase/auth';

const Login = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    async function handleLogin() {
        try {
            const provider = new GoogleAuthProvider();
            signInWithRedirect(auth, provider);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <View>
                <Image
                    className="w-20 h-20 m-auto"
                    source={require('../../assets/images/logo.png')}
                />
                <Text className="text-6xl font-bold tracking-wide text-center mb-10">
                    uprev.
                </Text>
                <Button
                    title="Sign in with Google"
                    color="red"
                    onPress={handleLogin}
                />
                <Text className="text-[12px] text-center mt-1">
                    Sign in with your @up.edu.ph email
                </Text>
            </View>
        </View>
    );
};

export default Login;
