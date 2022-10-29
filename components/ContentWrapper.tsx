import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import Navbar from './Navbar';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

const ContentWrapper = (props: PropsInterface) => {
    const { children } = props;

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <>
            <Navbar />
            <ScrollView className="flex-1 bg-white">{children}</ScrollView>
        </>
    );
};

export default ContentWrapper;
