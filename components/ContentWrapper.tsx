import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

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
        <View className="flex-1 justify-center items-center bg-white">
            {children}
        </View>
    );
};

export default ContentWrapper;
