import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

export function errorAlert(error: unknown) {
    console.error(error);
    let errorMsg = '';

    if (error instanceof Error) {
        errorMsg = error.message;
    }

    Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Oops! Something went wrong.',
        textBody: `${errorMsg}${
            errorMsg && '.\n\n'
        }Please contact Ezra Magbanua.`,
        button: 'Ok.',
    });
}
