import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import auth from '../../firebase/auth';
import AuthWrapper from '../../components/AuthWrapper';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId:
            '737445873573-ejficfrjtfm8i2edka3eh66vkguegdj2.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response]);

    const animatedLogo = useRef(new Animated.Value(70)).current;
    const animatedButtonsOpacity = useRef(new Animated.Value(0.01)).current;
    const animatedButtonsPosition = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedLogo, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(animatedButtonsOpacity, {
                delay: 800,
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(animatedButtonsPosition, {
                delay: 800,
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [animatedLogo, animatedButtonsOpacity, animatedButtonsPosition]);

    return (
        <AuthWrapper>
            <View className="flex-1 justify-center items-center bg-white">
                <View>
                    <Animated.View
                        style={{ transform: [{ translateY: animatedLogo }] }}
                    >
                        <Image
                            className="w-20 h-20 m-auto"
                            source={require('../../assets/images/logo.png')}
                        />
                        <Text className="text-6xl font-bold tracking-wide text-center mb-8">
                            uprev.
                        </Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            opacity: animatedButtonsOpacity,
                            transform: [
                                { translateY: animatedButtonsPosition },
                            ],
                        }}
                    >
                        <TouchableOpacity
                            className="py-3 px-8 border rounded-2xl"
                            disabled={!request}
                            onPress={() => promptAsync()}
                        >
                            <Text className="text-center text-lg">
                                Sign in with Google
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-[12px] text-center mt-1">
                            Sign in with your @up.edu.ph email
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </AuthWrapper>
    );
};

export default Login;
