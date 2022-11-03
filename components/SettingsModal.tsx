import {
    View,
    Text,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase/db';
import { PickerConfig } from '../interfaces/picker';
import { Picker } from '@react-native-picker/picker';
import { errorAlert } from '../helpers/errors';
import CheckBox from 'expo-checkbox';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { changeSubjectConfig, saveSubjectConfig } from '../helpers/config';
import ConfigContext from '../context/ConfigContext';

interface PropsInterface {
    onCloseModal: () => void;
}

const SettingsModal = (props: PropsInterface) => {
    const { onCloseModal } = props;

    const { setSubjects } = useContext(ConfigContext);
    const [picker, setPicker] = useState<PickerConfig[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [useCustomSubjects, setUseCustomSubjects] = useState<boolean>(false);
    const [customSubjects, setCustomSubjects] = useState<string>('');

    const [selectedCourse, setSelectedCourse] =
        useState<string>('Computer Science');
    const [selectedYear, setSelectedYear] = useState<number>(1);

    useEffect(() => {
        async function getAvailableCourses() {
            try {
                const docRef = doc(db, 'config', 'all');

                const data = (await (await getDoc(docRef)).data()) as Record<
                    string,
                    PickerConfig[]
                >;

                setIsLoading(false);
                setPicker(data.picker);
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        }

        getAvailableCourses();
    }, []);

    if (isLoading) {
        return <ActivityIndicator color="black" size="large" />;
    }

    const yearsConfig = picker.filter(
        (config) => config.course === selectedCourse,
    );

    function handleCheckbox() {
        setUseCustomSubjects((currentValue) => !currentValue);
    }

    async function handleCustomSubject() {
        const subjects = customSubjects.split(',').map((s) => s.toLowerCase());

        await saveSubjectConfig(subjects);
        if (setSubjects) {
            setSubjects(subjects);
        }
    }

    async function handleSave() {
        try {
            if (useCustomSubjects) {
                await handleCustomSubject();
            } else {
                const newSubjects = await changeSubjectConfig(
                    selectedCourse,
                    selectedYear,
                );

                if (setSubjects) {
                    setSubjects(newSubjects);
                }
            }

            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success!',
                textBody: 'Subjects on your home page are now updated.',
                button: 'Ok.',
                onPressButton: onCloseModal,
            });
        } catch (error) {
            errorAlert(error);
        }
    }

    return (
        <View className="w-full px-5">
            <Text className="font-bold">Course:</Text>
            <View className="mt-2 border rounded-xl">
                <Picker
                    enabled={!useCustomSubjects}
                    selectedValue={selectedCourse}
                    onValueChange={(value) => setSelectedCourse(value)}
                >
                    {!useCustomSubjects &&
                        picker.map(({ course }) => (
                            <Picker.Item
                                key={course}
                                label={course.toUpperCase()}
                                value={course}
                            />
                        ))}
                </Picker>
            </View>
            <Text className="mt-5">Year:</Text>
            <View className="mt-2 mb-5 border rounded-xl">
                <Picker
                    enabled={!useCustomSubjects}
                    selectedValue={selectedYear}
                    onValueChange={(year) => setSelectedYear(year)}
                >
                    {!useCustomSubjects &&
                        yearsConfig.map(({ years }) =>
                            [...Array(years).keys()].map((year) => (
                                <Picker.Item
                                    key={`${selectedCourse},${year + 1}`}
                                    label={(year + 1).toString()}
                                    value={year + 1}
                                />
                            )),
                        )}
                </Picker>
            </View>

            <View className="flex-row gap-2">
                <CheckBox
                    value={useCustomSubjects}
                    onValueChange={handleCheckbox}
                />
                <Text className={`${!useCustomSubjects && 'text-gray-400'}`}>
                    Use custom subjects
                </Text>
            </View>
            <>
                {useCustomSubjects && (
                    <View className="mt-2">
                        <View className="flex-row gap-2 flex-wrap">
                            <ExclamationTriangleIcon color="orange" />
                            <Text className="text-orange-500 flex-1">
                                Careful! Make sure to properly spell the subject
                                names. Currently, we only support up to 6 custom
                                subjects.
                            </Text>
                        </View>
                        <TextInput
                            multiline
                            editable={useCustomSubjects}
                            value={customSubjects}
                            onChangeText={(value) => setCustomSubjects(value)}
                            className="border mt-5 rounded-lg min-h-[80] p-2 w-full"
                        />
                        <Text>
                            Input your subjects separated by a comma. e.g. math
                            18, cmsc 10, cmsc 11
                        </Text>
                    </View>
                )}
            </>

            <TouchableOpacity
                className="p-2 py-3 border rounded-xl mt-12 w-36"
                onPress={handleSave}
            >
                <Text className="text-center">Save and Apply</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsModal;
