import { View, Text, Image } from 'react-native';
import React from 'react';

const Navbar = () => {
    return (
        <View className="flex-row justify-between items-center my-4">
            <View className="flex-row gap-1 items-center">
                <Image
                    className="h-6 w-6"
                    source={require('../assets/images/logo.png')}
                />
                <Text className="text-2xl font-bold tracking-wide">uprev.</Text>
            </View>
            <Text>Logout</Text>
        </View>
    );
};

export default Navbar;
