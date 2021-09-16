import React, {useState} from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from 'StripeModal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

// Files
import logoImage  from 'assets/logo.png';
import tgr from 'assets/tgr.png';
import alienation from 'assets/Vox.png'

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

const ProjectsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
`;

const ProjectBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    height: 200px;
    border: 1px solid white;
`;

const Link = styled.a`
    color: white;
    font-size: 1.2em;
`;

const ProjectImg = styled.img`
    width: 80%;
`;

const AppLanding = () => {
    const [displayForm, setDisplayForm] = useState(false);

    const handleStripeModalClose = () => {
        setDisplayForm(false);
    };

    return(
        <Container>
            <LogoContainer><img src={logoImage} width='200px'/></LogoContainer>
            <ProjectsContainer>
                <ProjectBox>
                    <Link href='/the-great-refusal'>The Great Refusal</Link>
                    <ProjectImg src={tgr} />
                </ProjectBox>
                <ProjectBox>
                    <Link href='/alienation-dance'>The Alienation Dance</Link>
                    <ProjectImg src={alienation} />
                </ProjectBox>
            </ ProjectsContainer>
            <Button
                    onClick={() => setDisplayForm(true)}
            >Support these projects!</Button>
            <StripeModal 
                open={displayForm}
                handleClose={handleStripeModalClose}
            />
        </Container>
    )
};

export default AppLanding;