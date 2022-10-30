export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Quiz: { subject: string; id: string };
    QuizList: { subject: string };
    FlashcardList: { subject: string };
};
