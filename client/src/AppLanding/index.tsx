import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from "StripeModal";
import styled from "styled-components";

import { ScreenSizeType } from "shared/types";
import Login from "Auth/Login";
// import MastodonFeed from 'Mastodon';

type MobileProps = {
  isMobile: boolean;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 60px 0;
  background-color: black;
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
  width: ${(props) => (props.isMobile ? "300px" : "600px")};
  text-align: center;
`;

const IntroText = styled.p`
  color: white;
  font-size: 1em;
  margin: 20px 0 40px 0;
`;

const TextLink = styled.a`
  color: white;
  font-size: 1.2em;
`;

// const BlockLink = styled.a`
//   text-decoration: none;
// `;

// const ProjectImg = styled.img`
//   width: 100%;
// `;
const LeftBox = styled.div`
  display: flex;
  justify-content: center;
  flex: 2;
`;
const RightBox = styled.div`
  flex: 1;
`;

const AppLanding = ({ screenSize }: { screenSize: ScreenSizeType }) => {
  const [displayForm, setDisplayForm] = useState(false);
  const isMobile = screenSize !== "desktop";
  const handleStripeModalClose = () => {
    setDisplayForm(false);
  };
  return (
    <Container>
      <LeftBox>
        <IntroTextContainer isMobile={isMobile}>
          <H1 isMobile={isMobile}>Rafart Music Platform</H1>

          <IntroText>
            Welcome to the Rafart music community portal. By loggin in you can
            listen to my music, try out music tech projects, access exclusive
            content, support my projects, or just chat with me.{" "}
          </IntroText>
          <IntroText>
            This is a platform to share all the activities of the Rafart music
            project in one place, replacing the need and dependence on Social
            Media and streaming services like IG, Facebook, Tiktok, Spotify,
            Patreon, Youtube, Discord, etc.
          </IntroText>
          <IntroText>
            This app is an open source project, and you can use it for your
            personal music portal. Check out the GitHub{" "}
            {
              <TextLink href="https://github.com/franciscorafart/rafart-music-app">
                repo
              </TextLink>
            }
            .
          </IntroText>
        </IntroTextContainer>
      </LeftBox>
      <RightBox>
        <Login />
      </RightBox>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} />
    </Container>
  );
};

export default AppLanding;
