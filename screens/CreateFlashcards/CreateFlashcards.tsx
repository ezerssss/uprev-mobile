import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import {
    CardsInterface,
    FlashcardInterface,
} from '../../interfaces/flashcards';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/routes.type';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import AuthWrapper from '../../components/AuthWrapper';
import ContentWrapper from '../../components/ContentWrapper';
import { Picker } from '@react-native-picker/picker';
import Flashcard from './components/Flashcard';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const CreateFlashcards = ({
    route,
}: NativeStackScreenProps<RootStackParamList, 'CreateFlashcard'>) => {
    let isEditing = false;
    let id: undefined | string = undefined;
    let subject: undefined | string = undefined;
    if (route.params) {
        isEditing = route.params.isEditing;
        id = route.params.id;
        subject = route.params.subject;
    }

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, isUpEmail } = useContext(UserContext);
    const [title, setTitle] = useState<string>('');
    const [cards, setCards] = useState<CardsInterface[]>([
        {
            keyword: '',
            description: '',
            number: 0,
        },
    ]);
    const [number, setNumber] = useState<number>(1);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [dropdownSelection, setDropdownSelection] =
        useState<string>('math 18');

    const postButtonText = isEditing ? 'Edit Flashcards' : 'Post Flashcards';

    useEffect(() => {
        async function getFirestoreDocument() {
            if (!id) {
                return;
            }

            if (!subject) {
                return;
            }

            const docRef = doc(db, 'subjects', subject, 'flashcards', id);
            try {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data() as FlashcardInterface;

                setDropdownSelection(subject);
                let highestNumber = 0;

                data.cards.forEach((card) => {
                    if (card.number > highestNumber) {
                        highestNumber = card.number;
                    }
                });

                setNumber(highestNumber + 1);
                setTitle(data.title);
                setCards(data.cards);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestoreDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, id]);

    const renderSubmitButton = isPosting ? (
        <ActivityIndicator color="black" />
    ) : (
        <Text>{postButtonText}</Text>
    );

    function handleDelete(number: number) {
        setCards(cards.filter((card) => card.number !== number));
    }

    function handleCardEdit(text: string, number: number, key: string) {
        const index = cards.findIndex((object) => object.number === number);

        if (index < 0) return;

        const question = cards[index] as Record<string, any>;
        question[key] = text;

        cards[index] = question as CardsInterface;

        setCards([...cards]);
    }

    function handleAddAnotherCard() {
        const card: CardsInterface = {
            keyword: '',
            description: '',
            number,
        };

        setNumber(number + 1);
        setCards([...cards, card]);
    }

    async function handleEdit(object: FlashcardInterface) {
        if (!id) {
            console.error('No Id found');
            return;
        }

        if (!subject) {
            console.error('No subject found');
            return;
        }

        const docRef = doc(db, 'subjects', subject, 'flashcards', id);

        await updateDoc(docRef, { ...object });
    }

    async function handlePost(
        object: FlashcardInterface,
        subject: string,
    ): Promise<string> {
        const doc = await addDoc(
            collection(db, 'subjects', subject, 'flashcards'),
            object,
        );

        return doc.id;
    }

    function handleRedirectToFlashcard(id?: string) {
        const subject = dropdownSelection;

        if (!id || !subject) return;

        navigation.navigate('Flashcard', { subject, id });
    }

    async function handleSubmit() {
        setIsPosting(true);
        if (!isUpEmail) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Wait a minute!',
                textBody: 'To post your flashcards, you must use your UP email',
                button: 'Ok.',
            });
            setIsPosting(false);

            return;
        }

        const subject = dropdownSelection;
        const object: FlashcardInterface = {
            creator: user?.displayName || '-',
            email: user?.email || '-',
            title,
            cards,
        };

        try {
            if (isEditing) {
                handleEdit(object);
            } else {
                id = await handlePost(object, subject);
            }

            setIsPosting(false);

            const popUpText = isEditing
                ? 'Flashcards Edited'
                : 'Flashcards Posted';

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: `${popUpText}. Click the button to redirect to the flashcards page.`,
                button: 'Redirect',
                onPressButton: () => handleRedirectToFlashcard(id),
            });
        } catch (error) {
            errorAlert(error);
            setIsPosting(false);
        }
    }

    return (
        <AuthWrapper>
            <ContentWrapper>
                <View className="flex-row gap-2 items-center">
                    <Text className="text-lg">Subject: </Text>
                    <View className="border rounded-xl flex-1 lg:flex-none lg:w-[300]">
                        <Picker
                            selectedValue={dropdownSelection}
                            itemStyle={{
                                height: 100,
                                fontSize: 13.5,
                                width: 300,
                            }}
                            onValueChange={(value) =>
                                setDropdownSelection(value)
                            }
                        >
                            <Picker.Item label="MATH 18" value="math 18" />
                            <Picker.Item label="CMSC 10" value="cmsc 10" />
                            <Picker.Item label="CMSC 11" value="cmsc 11" />
                            <Picker.Item label="CMSC 56" value="cmsc 56" />
                        </Picker>
                    </View>
                </View>
                <View className="flex-row gap-2 my-3 items-center">
                    <Text className="text-lg">Title: </Text>
                    <TextInput
                        className="border rounded-xl p-2 flex-1 lg:flex-none lg:w-1/2"
                        placeholder="Enter Title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                </View>
                <View className="my-5">
                    {cards.map((card) => (
                        <Flashcard
                            key={card.number}
                            card={card}
                            onEdit={handleCardEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </View>
                <View className="flex-row gap-2 justify-center items-center mb-5">
                    <TouchableOpacity
                        className="p-2 border rounded-xl"
                        onPress={handleAddAnotherCard}
                    >
                        <Text className="text-sm">Add another card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-2 border rounded-xl"
                        onPress={handleSubmit}
                    >
                        {renderSubmitButton}
                    </TouchableOpacity>
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default CreateFlashcards;
