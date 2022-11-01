import { Text, Animated, Pressable } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { CardsInterface } from '../../../interfaces/flashcards';
import { FlashcardModeEnum } from '../../../enums/flashcard-mode.enum';
import { shuffle } from '../../../helpers/shuffle';

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

    const animatedValue = useRef(new Animated.Value(0)).current;

    let recordedValue = 0;

    useEffect(() => {
        const listenerId = animatedValue.addListener(({ value }) => {
            recordedValue = value;
        });

        return () => animatedValue.removeListener(listenerId);
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
            recordedValue = 180;
        } else {
            recordedValue = 0;
        }

        Animated.spring(animatedValue, {
            toValue: springValue,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }

    function handleLongPress() {
        if (recordedValue <= 90) {
            onLongPress(first);
            return;
        }

        onLongPress(second);
    }

    return (
        <Pressable
            className="flex-1 relative rounded-xl overflow-visible"
            onPress={handleFlip}
            onLongPress={handleLongPress}
        >
            <Animated.View
                className="flex-1 items-center justify-center bg-white border rounded-xl p-4"
                style={[
                    {
                        backfaceVisibility: 'hidden',
                    },
                    frontAnimatedStyle,
                ]}
            >
                <Text className="text-center text-base" numberOfLines={7}>
                    {first}
                </Text>
            </Animated.View>
            <Animated.View
                className="flex-1 w-full h-full border rounded-xl bg-white absolute items-center justify-center p-4"
                style={[
                    {
                        backfaceVisibility: 'hidden',
                    },
                    backAnimatedStyle,
                ]}
            >
                <Text className="text-center text-base" numberOfLines={7}>
                    {second}
                </Text>
            </Animated.View>
        </Pressable>
    );
};

export default Card;
