import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultSubjects } from '../constants/defaults';
import db from '../firebase/db';

function validateSubjects(subjects: string[]) {
    while (subjects.length < 6) {
        subjects.push('');
    }

    return subjects;
}

export async function changeSubjectConfig(
    course: string,
    year: number,
): Promise<string[]> {
    const docRef = doc(db, 'config', course);
    const data = (await (await getDoc(docRef)).data()) as Record<
        number,
        Record<string, string[]>
    >;

    const subjects = validateSubjects(data[year].subjects);
    await saveSubjectConfig(subjects);

    return subjects;
}

export async function saveSubjectConfig(subjects: string[]) {
    const validatedSubjects = validateSubjects(subjects);
    const json = JSON.stringify(validatedSubjects);

    await AsyncStorage.setItem('subjects', json);
}

export async function getSubjectsConfig(): Promise<string[]> {
    const subjectsValue = await AsyncStorage.getItem('subjects');

    if (!subjectsValue) {
        return validateSubjects(defaultSubjects);
    }

    const subjects = JSON.parse(subjectsValue) as string[];

    return validateSubjects(subjects);
}
