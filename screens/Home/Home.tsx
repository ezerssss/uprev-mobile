import { Image, useWindowDimensions } from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

function Home() {
    const { height } = useWindowDimensions();

    return (
        <ContentWrapper>
            <Image
                className="m-auto w-full"
                resizeMode="contain"
                style={{ height: height * 0.3 }}
                source={require('../../assets/images/corporate-image.png')}
            />
        </ContentWrapper>
    );
}

export default Home;
