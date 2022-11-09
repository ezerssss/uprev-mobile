import { User } from 'firebase/auth';
import { createContext } from 'react';

const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
    isEmailWhitelisted: boolean;
    setIsEmailWhitelisted: React.Dispatch<React.SetStateAction<boolean>> | null;
}>({
    user: null,
    setUser: null,
    isEmailWhitelisted: false,
    setIsEmailWhitelisted: null,
});

export default UserContext;
