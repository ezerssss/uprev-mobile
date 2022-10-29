import { User } from 'firebase/auth';
import { createContext } from 'react';

const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
    isUpEmail: boolean;
    setIsUpEmail: React.Dispatch<React.SetStateAction<boolean>> | null;
}>({ user: null, setUser: null, isUpEmail: false, setIsUpEmail: null });

export default UserContext;
