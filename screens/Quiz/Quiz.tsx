import { View, Text } from 'react-native';
import React from 'react';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';

const Quiz = () => {
    return (
        <AuthWrapper>
            <ContentWrapper>
                <Text>Quiz</Text>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default Quiz;
