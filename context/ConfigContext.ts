import { createContext } from 'react';

const ConfigContext = createContext<{
    subjects: string[];
    setSubjects: React.Dispatch<React.SetStateAction<string[]>> | null;
}>({ subjects: [], setSubjects: null });

export default ConfigContext;
