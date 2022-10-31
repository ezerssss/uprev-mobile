export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    CreateQuiz: { isEditing: boolean; id: string; subject: string } | undefined;
    Quiz: { subject: string; id: string };
    QuizList: { subject: string };
    CreateFlashcard:
        | { isEditing: boolean; id: string; subject: string }
        | undefined;
    Flashcard: { subject: string; id: string };
    FlashcardList: { subject: string };
};
