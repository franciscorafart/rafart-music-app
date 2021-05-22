import React, {useEffect, useState} from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from 'StripeModal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

// Files
import logoImage  from 'assets/logo.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: black;
    min-height: 900px;
`;

const LogoContainer = styled.div`
    width: 200px;
    margin: 40px 0;
`;

const IFrame = styled.iframe`
    margin-bottom: 40px;
`;

const sizes = {
    desktop: {
        w: '760',
        h: '428',
    },
    tablet: {
        w: '560',
        h: '315',
    },
    mobile: {
        w: '320',
        h: '180',
    },
}

const AppLanding = () => {
    const [displayForm, setDisplayForm] = useState(true);

    const handleStripeModalClose = () => {
        setDisplayForm(false);
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const screenSize = windowWidth >= 800 ? 'desktop' : windowWidth < 600 ? 'mobile' : 'tablet';

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    const screen = sizes[screenSize];
    return(
        <Container>
            <LogoContainer><img src={logoImage} width='200px'/></LogoContainer>

            <IFrame width={screen.w} height={screen.h} src="https://www.youtube.com/embed/Z2OJ7LFOoFo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></IFrame>    
            <Button
                    onClick={() => setDisplayForm(true)}
            >Support this project</Button>
            <StripeModal 
                open={displayForm}
                handleClose={handleStripeModalClose}
            />
        </Container>
    )
};

export default AppLanding;