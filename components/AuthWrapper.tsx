import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import UserContext from '../context/UserContext';
import { Routes } from '../enums/route.enums';
import auth from '../firebase/auth';
import db from '../firebase/db';
import { User } from '../interfaces/user';
import { RootStackParamList } from '../types/routes.type';

interface PropsInterface {
    children: JSX.Element;
}

function AuthWrapper(props: PropsInterface) {
    const { children } = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setUser, setIsEmailWhitelisted } = useContext(UserContext);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const route = useRoute();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const noUser = !user;

            if (noUser) {
                if (route.name === Routes.LOGIN) setIsLoading(false);
                else navigation.navigate('Login');
                return;
            }

            const whitelistDocRef = doc(db, 'config', 'emails');
            const whitelistData = (await (
                await getDoc(whitelistDocRef)
            ).data()) as Record<string, string[]>;

            const isEmailWhitelisted = !!whitelistData.whitelist.find((data) =>
                user.email?.includes(data),
            );

            if (setIsEmailWhitelisted) {
                setIsEmailWhitelisted(isEmailWhitelisted);
            }

            if (route.name === Routes.LOGIN) {
                if (isEmailWhitelisted) {
                    const userDocument: User = {
                        displayName: user.displayName || '-',
                        email: user.email || '-',
                        photoURL: user.photoURL || '-',
                    };

                    const docRef = doc(db, 'users', user.uid);

                    await setDoc(docRef, userDocument, {
                        merge: true,
                    });
                }

                if (setUser) {
                    setUser(user);
                }
                setIsLoading(false);
                navigation.navigate(Routes.HOME);

                return;
            }

            if (setUser) {
                setUser(user);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const render = isLoading ? (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="animate-pulse font-bold text-6xl tracking-wide -mt-5">
                uprev.
            </Text>
            <ActivityIndicator color="black" size="large" />
        </View>
    ) : (
        children
    );

    return <>{render}</>;
}

export default AuthWrapper;
