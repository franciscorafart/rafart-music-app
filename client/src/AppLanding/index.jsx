import React, {useState} from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from 'StripeModal';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

// Files
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

const ProjectsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
`;

const ProjectBox = styled.div`
    display: flex;
    flex-direction: ${props => props.isMobile ? 'column' : 'row'};
    align-items: ${props => props.isMobile ? 'center' : 'flex-start'};
    border: 1px solid white;
    padding: 5px;
`;

const ImageBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    height: 200px;
`;

const H1 = styled.h1`
    font-size: ${props => props.isMobile ? '2em': '2.5em'};
    color: white;
    text-align: center;
`;

const IntroTextContainer = styled.div`
    width: ${props => props.isMobile ? '300px': '400px'};
    text-align: center;
`;

const IntroText = styled.p`
    color: white;
    font-size: 0.8em;
    margin: 20px 0 40px 0;
`;

const TextBox = styled.p`
    color: white;
    font-size: 0.8em;
    width: 300px;
    padding: 10px;
`;

const Link = styled.a`
    color: white;
    font-size: 1.2em;
`;

const ProjectImg = styled.img`
    width: ${props => props.isMobile ? '50%' : '80%' };
`;

const AppLanding = ({screenSize}) => {
    const [displayForm, setDisplayForm] = useState(false);
    const isMobile = screenSize !== 'desktop';

    const handleStripeModalClose = () => {
        setDisplayForm(false);
    };
    return(
        <Container>
            <IntroTextContainer isMobile={isMobile}>
                <H1 isMobile={isMobile}>Music Tech Projects</H1>
                <IntroText>
                    Besides being a Stick player I'm a web developer and enjoy using code and technology to expand the possibilities of my music. 
                    In this app there's different Musich Tech projects I have worked on through the years.
                    The code of this app is public and you can find it in this {<Link href='https://github.com/franciscorafart/rafart-music-app'>github</Link>} repository
                </IntroText>
            </IntroTextContainer>
            <ProjectsContainer isMobile={isMobile}>
                <ProjectBox isMobile={isMobile}>
                    <ImageBox>
                        <Link href='/the-great-refusal'>The Great Refusal</Link>
                        <ProjectImg src={tgr} />
                    </ImageBox>
                    <TextBox isMobile={isMobile}>
                        The Great Refusal is an audio visual musical performance based on the book Eros and Civilization by H. Marcuse. 
                        In this show, I play a hybrid electronic and instrumental set along side animations projected into a 
                        custom built stage in the form of a Koch fractal, and controled live from the stage. 
                        This project was made possible by the LAB 2020 grant by the Boston Foundation.
                    </TextBox>
                </ProjectBox>
                <ProjectBox isMobile={isMobile}>
                    <ImageBox>
                        <Link href='/alienation-dance'>The Alienation Dance</Link>
                        <ProjectImg src={alienation} />
                    </ImageBox>
                    <TextBox isMobile={isMobile}>
                        The Alienation Dance is an interactive song released as a web app. The app allows you to do a live mix of the song on your browser, 
                        while playing animations by Brazilian artist Benjamin Ramos. 
                    </TextBox>
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