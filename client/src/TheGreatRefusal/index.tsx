import { useEffect, useState } from "react";
import { ScreenSizeType } from "shared/types";
import "bootstrap/dist/css/bootstrap.min.css";

import StripeModal from "StripeModal";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: black;
  min-height: 900px;
`;

interface Props {
  isMobile: boolean;
}

const IFrame = styled.iframe`
  margin-bottom: 60px;
`;

const H1 = styled.h1`
  color: white;
`;

const H2 = styled.h2<Props>`
  color: white;
  font-size: ${(props) => (props.isMobile ? "1em" : "1.2em")};
  margin-bottom: 20px;
`;

const TextContainer = styled.div<Props>`
  width: ${(props) => (props.isMobile ? "90%" : "50%")};
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.p`
  color: white;
  text-align: center;
`;

const sizes = {
  desktop: {
    w: "760",
    h: "428",
  },
  tablet: {
    w: "560",
    h: "315",
  },
  mobile: {
    w: "320",
    h: "180",
  },
};

const TheGreatRefusal = ({ screenSize }: { screenSize: ScreenSizeType }) => {
  const [displayForm, setDisplayForm] = useState(false);

  const handleStripeModalClose = () => {
    setDisplayForm(false);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const screen = sizes[screenSize];
  const isMobile = screenSize !== "desktop";

  return (
    <Container>
      <TextContainer isMobile={isMobile}>
        <H1>The Great Refusal</H1>
        <Description>
          The Great Refusal is an audiovisual performance based on "Eros and
          Civilization" by H. Marcuse. This musical part of the show is a set of
          six original songs performed with the Chapman Stick, my voice, and
          live looping with Ableton Live, a drum machine, and a looper pedal.
          For the visual part of the show, the venue comes to life through a
          custom-built screen to which I project images controlled from the
          stage, using the projection mapping technique.
        </Description>
        <Description>
          The Great Refusal was made possible by the Live Arts Boston grant 2020
          by the Boston Foundation.
        </Description>
        <Button onClick={() => setDisplayForm(true)}>
          Support this project!
        </Button>
      </TextContainer>
      <H2 isMobile={isMobile}>Dorchester Arts Project - November 2020</H2>
      <IFrame
        width={screen.w}
        height={screen.h}
        src="https://www.youtube.com/embed/zkDYKirV4LU"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <H2 isMobile={isMobile}>Dorchester Arts Project - June 2021</H2>
      <IFrame
        width={screen.w}
        height={screen.h}
        src="https://www.youtube.com/embed/DqQxDBfEJCU"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} />
    </Container>
  );
};

export default TheGreatRefusal;
