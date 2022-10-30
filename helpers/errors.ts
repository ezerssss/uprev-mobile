import { Alert } from 'react-native';

export function errorAlert(error: unknown) {
    console.error(error);
    let errorMsg = '';

    if (error instanceof Error) {
        errorMsg = error.message;
    }

    Alert.alert(
        'Something went wrong',
        `${errorMsg}${errorMsg && '.\n\n'}Please contact Ezra Magbanua.`,
        [
            {
                text: 'OK',
            },
        ],
    );
}
