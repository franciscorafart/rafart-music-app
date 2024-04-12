import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from "StripeModal";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

// Files
import tgr from "assets/tgr.png";
import alienation from "assets/Vox.png";
import { ScreenSizeType } from "shared/types";
// import MastodonFeed from 'Mastodon';

type MobileProps = {
  isMobile: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: black;
  min-height: 900px;
`;

const ProjectsContainer = styled.div<MobileProps>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 40px 0 20px 0;
`;

const ProjectBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid white;
  padding: 5px;
  border-radius: 10px;
`;

const SubBox = styled.div<MobileProps>`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
`;

const ImageBox = styled.div`
  padding: 10px;
  width: 300px;
  height: 300px;
`;

const H1 = styled.h1<MobileProps>`
  font-size: ${(props) => (props.isMobile ? "2em" : "2.5em")};
  color: white;
  text-align: center;
`;

const IntroTextContainer = styled.div<MobileProps>`
  width: ${(props) => (props.isMobile ? "300px" : "400px")};
  text-align: center;
`;

const IntroText = styled.p`
  color: white;
  font-size: 0.8em;
  margin: 20px 0 40px 0;
`;

const TextBox = styled.p<MobileProps>`
  color: white;
  font-size: 0.8em;
  text-align: justify;
  width: ${(props) => (props.isMobile ? "300px" : "300px")};
  padding: 10px;
`;

const ProjectTitle = styled.h3`
  color: white;
  font-size: 1.4em;
`;

const Subtitle = styled.h3`
  color: white;
  font-size: 1em;
`;

const TextLink = styled.a`
  color: white;
  font-size: 1.2em;
`;

const BlockLink = styled.a`
  text-decoration: none;
`;

const ProjectImg = styled.img`
  width: 100%;
`;

const FansPortal = ({ screenSize }: { screenSize: ScreenSizeType }) => {
  const [displayForm, setDisplayForm] = useState(false);
  const isMobile = screenSize !== "desktop";

  const handleStripeModalClose = () => {
    setDisplayForm(false);
  };
  return (
    <Container>
      <IntroTextContainer isMobile={isMobile}>
        <H1 isMobile={isMobile}>Music Tech Projects</H1>
        <IntroText>
          Besides being a Stick player, I'm a web developer and enjoy using code
          and technology to expand the possibilities of my music. There are
          different Musich Tech projects I have worked on through the years in
          this app. You can find the code for this app{" "}
          {
            <TextLink href="https://github.com/franciscorafart/rafart-music-app">
              here
            </TextLink>
          }
          .
        </IntroText>
      </IntroTextContainer>
      <Button onClick={() => setDisplayForm(true)}>
        Support these projects!
      </Button>
      <ProjectsContainer isMobile={isMobile}>
        <BlockLink href="/the-great-refusal">
          <ProjectBox>
            <ProjectTitle>The Great Refusal</ProjectTitle>
            <Subtitle>Audiovisual Musical Performance</Subtitle>
            <SubBox isMobile={isMobile}>
              <ImageBox>
                <ProjectImg src={tgr} />
              </ImageBox>
              <TextBox isMobile={isMobile}>
                The Great refusal is an audiovisual show based on the book Eros
                and Civilization by H. Marcuse. In this performance, I play a
                hybrid electronic and instrumental set and project animations
                into a custom-built stage. This project was made possible by the
                LAB 2020 grant by the Boston Foundation.
              </TextBox>
            </SubBox>
          </ProjectBox>
        </BlockLink>
        <BlockLink href="/alienation-dance">
          <ProjectBox>
            <ProjectTitle>The Alienation Dance</ProjectTitle>
            <Subtitle>Interactive Web Song</Subtitle>
            <SubBox isMobile={isMobile}>
              <ImageBox>
                <ProjectImg src={alienation} />
              </ImageBox>
              <TextBox isMobile={isMobile}>
                The Alienation Dance is a song released as an interactive app.
                The app allows you to do a live mix of the music on your browser
                while playing animations by Brazilian artist Benjamin Ramos.
              </TextBox>
            </SubBox>
          </ProjectBox>
        </BlockLink>
        {/* <MastodonFeed /> */}
      </ProjectsContainer>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} />
    </Container>
  );
};

export default FansPortal;
