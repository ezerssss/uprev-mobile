import { ScrollView } from 'react-native';
import Navbar from './Navbar';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

const ContentWrapper = (props: PropsInterface) => {
    const { children } = props;

    return (
        <>
            <Navbar />
            <ScrollView className="flex-1 bg-white px-4 lg:px-40">
                {children}
            </ScrollView>
        </>
    );
};

export default ContentWrapper;
