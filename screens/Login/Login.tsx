import * as Google from 'expo-auth-session/providers/google';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import auth from '../../firebase/auth';
import AuthWrapper from '../../components/AuthWrapper';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId:
            '737445873573-k6adbdiobhgvfi4m6ll1n1cq7cc9chd0.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response]);

    return (
        <AuthWrapper>
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
                        color="red"
                        title="Sign in with Google"
                        disabled={!request}
                        onPress={() => promptAsync()}
                    />
                    <Text className="text-[12px] text-center mt-1">
                        Sign in with your @up.edu.ph email
                    </Text>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default Login;
