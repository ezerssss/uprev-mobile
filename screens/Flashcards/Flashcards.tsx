import {
    View,
    Text,
    useWindowDimensions,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/routes.type';
import {
    CardsInterface,
    FlashcardInterface,
} from '../../interfaces/flashcards';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import { shuffle } from '../../helpers/shuffle';
import Carousel from 'react-native-reanimated-carousel';
import {
    GestureHandlerRootView,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { XMarkIcon } from 'react-native-heroicons/outline';
import Navbar from '../../components/Navbar';
import Card from './components/Card';
import { FlashcardModeEnum } from '../../enums/flashcard-mode.enum';

const Flashcards = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'Flashcard'>) => {
    const { subject, id } = route.params;
    const { width, height } = useWindowDimensions();

    const [flashcards, setFlashcards] = useState<FlashcardInterface | null>(
        null,
    );
    const [mode, setMode] = useState<FlashcardModeEnum>(
        FlashcardModeEnum.RANDOM,
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedCardContent, setSelectedCardContent] = useState<string>('');

    useEffect(() => {
        async function getFirestore() {
            try {
                const flashcardRef = doc(
                    db,
                    'subjects',
                    subject,
                    'flashcards',
                    id,
                );

                const flashcardSnapshot = await getDoc(flashcardRef);
                if (!flashcardSnapshot.exists()) {
                    throw Error(`Quiz not Found: ${id}`);
                }
                const data = flashcardSnapshot.data() as FlashcardInterface;
                data.cards = shuffle(data.cards);

                setFlashcards(data);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestore();
    }, [subject, id]);

    function handleLongPress(content: string) {
        setIsModalOpen(true);
        setSelectedCardContent(content);
    }

    const showElements = !!flashcards;

    const renderCarousel = flashcards?.cards && (
        <GestureHandlerRootView className="items-center py-5 flex-1 mb-10">
            <Carousel
                loop
                snapEnabled
                pagingEnabled
                data={flashcards.cards}
                mode="horizontal-stack"
                modeConfig={{
                    snapDirection: 'right',
                    stackInterval: 18,
                }}
                style={{ overflow: 'visible' }}
                width={300}
                height={300}
                renderItem={({ index }) => (
                    <Card
                        key={index}
                        card={flashcards.cards[index]}
                        mode={mode}
                        onLongPress={handleLongPress}
                    />
                )}
            />
        </GestureHandlerRootView>
    );

    const renderModal = isModalOpen && selectedCardContent && (
        <View
            className="z-20 absolute items-center justify-center p-4 lg:p-40"
            style={{ width: width, height: height }}
        >
            <View className="relative bg-white border rounded-xl w-full flex-1 max-h-[500] items-center justify-center p-5">
                <TouchableOpacity
                    className="mb-5 absolute top-5 right-5"
                    onPress={handleCloseModal}
                >
                    <XMarkIcon color="black" />
                </TouchableOpacity>
                <Text className="text-justify text-[14]">
                    {selectedCardContent}
                </Text>
            </View>
        </View>
    );

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    function handleModeClick(buttonMode: FlashcardModeEnum) {
        setMode(buttonMode);
    }

    function buttonColor(buttonMode: FlashcardModeEnum): string {
        if (mode !== buttonMode) return '';

        return 'bg-red-300';
    }

    return (
        <AuthWrapper>
            <>
                <>{renderModal}</>
                <ContentWrapper>
                    <Text className="text-4xl font-bold mt-5">
                        {flashcards?.title}
                    </Text>
                    <>
                        {showElements && (
                            <Text className="text-[12px] my-2">
                                By: {flashcards?.creator} | {flashcards?.email}
                            </Text>
                        )}
                    </>
                    <Text className="mt-3">Press the card to flip.</Text>
                    <Text className="mt-1">Long press to expand the card.</Text>
                    <Text className="mt-5 mb-2">Flashcards Mode: </Text>
                    <View className="flex-row gap-2 mb-5">
                        <TouchableOpacity
                            className={`p-2 border rounded-xl ${buttonColor(
                                FlashcardModeEnum.RANDOM,
                            )}`}
                            onPress={() =>
                                handleModeClick(FlashcardModeEnum.RANDOM)
                            }
                        >
                            <Text>Random</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`p-2 border rounded-xl ${buttonColor(
                                FlashcardModeEnum.KEYWORD,
                            )}`}
                            onPress={() =>
                                handleModeClick(FlashcardModeEnum.KEYWORD)
                            }
                        >
                            <Text>Keyword First</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`p-2 border rounded-xl ${buttonColor(
                                FlashcardModeEnum.DESCRIPTION,
                            )}`}
                            onPress={() =>
                                handleModeClick(FlashcardModeEnum.DESCRIPTION)
                            }
                        >
                            <Text>Description First</Text>
                        </TouchableOpacity>
                    </View>
                    <>{renderCarousel}</>
                </ContentWrapper>
            </>
        </AuthWrapper>
    );
};

export default Flashcards;
