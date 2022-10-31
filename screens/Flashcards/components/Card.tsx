import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect } from 'react';
import { CardsInterface } from '../../../interfaces/flashcards';
import { FlashcardModeEnum } from '../../../enums/flashcard-mode.enum';
import { shuffle } from '../../../helpers/shuffle';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface PropsInterface {
    card: CardsInterface;
    mode: FlashcardModeEnum;
    onLongPress: (content: string) => void;
}

const Card = (props: PropsInterface) => {
    const { card, mode, onLongPress } = props;
    const { keyword, description } = card;
    const randomlyArrangedText = shuffle([keyword, description]);
    let first = randomlyArrangedText[0];
    let second = randomlyArrangedText[1];

    if (mode === FlashcardModeEnum.KEYWORD) {
        first = keyword;
        second = description;
    } else if (mode === FlashcardModeEnum.DESCRIPTION) {
        first = description;
        second = keyword;
    }

    const animatedValue = new Animated.Value(0);

    let recordedValue = 0;

    useEffect(() => {
        animatedValue.addListener(({ value }) => {
            recordedValue = value;
        });
    }, []);

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };
    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    function handleFlip() {
        let springValue = 0;

        if (recordedValue <= 90) {
            springValue = 180;
        }

        Animated.spring(animatedValue, {
            toValue: springValue,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }

    return (
        <View className="flex-1 relative">
            <Animated.View
                className="flex-1 items-center justify-center"
                style={[
                    {
                        backfaceVisibility: 'hidden',
                    },
                    frontAnimatedStyle,
                ]}
            >
                <TouchableWithoutFeedback
                    containerStyle={{
                        flex: 1,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderRadius: 20,
                        padding: 15,
                    }}
                    onLongPress={() => onLongPress(first)}
                    onPress={handleFlip}
                >
                    <Text className="text-center text-base" numberOfLines={7}>
                        {first}
                    </Text>
                </TouchableWithoutFeedback>
            </Animated.View>
            <Animated.View
                className="flex-1 w-full h-full"
                style={[
                    { backfaceVisibility: 'hidden', position: 'absolute' },
                    backAnimatedStyle,
                ]}
            >
                <TouchableWithoutFeedback
                    containerStyle={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderRadius: 20,
                        padding: 15,
                    }}
                    onLongPress={() => onLongPress(second)}
                    onPress={handleFlip}
                >
                    <Text className="text-center text-base" numberOfLines={7}>
                        {second}
                    </Text>
                </TouchableWithoutFeedback>
            </Animated.View>
        </View>
    );
};

export default Card;
