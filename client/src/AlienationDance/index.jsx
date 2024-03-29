import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { isEmpty } from "lodash";
// import { ScreenSizeType } from 'shared/types';
import "bootstrap/dist/css/bootstrap.min.css";

import InstrumentComponent from "./InstrumentComponent";
import useWindowSize from "utils/hooks/useWindowSize";
import Audio from "./AudioEngine";
import StripeModal from "StripeModal";
import styled from "styled-components";

import { addAudioBuffer, playBuffer } from "./audioUtils";

// Files
import mask from "assets/Mask.png";

const MENU_HEIGHT = 56;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background-color: black;
`;

const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArrowText = styled.span`
  font-size: 0.7em;
  color: #d3dded;
`;

const LogoContainer = styled.div`
  height: 100px;
  height: ${(props) => `${props.logoContainerHeight}px`};
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  row-gap: 5px;
`;

const MixerContainer = styled.div`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40%;
  padding: 20px 0 20px 0;
  gap: ${(props) => (props.mobile ? "10px" : "0")};
`;

const Video = styled.video`
  position: absolute;
  top: ${(props) => `${props.logoContainerHeight + MENU_HEIGHT}px`};
  left: ${(props) => `${props.marginPad}px`};
`;

const Mask = styled.img`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  position: absolute;
  top: ${(props) => `${props.logoContainerHeight + MENU_HEIGHT}px`};
  left: ${(props) => `${props.marginPad}px`};
`;

const isProduction = process.env.NODE_ENV === "production";
// const isProduction = true
const getFilesEndpoint = isProduction
  ? process.env.REACT_APP_GET_FILES_LAMBDA
  : "/get_files";

const AlienationDance = () => {
  const [displayForm, setDisplayForm] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(true);
  const [audioActive, setAudioActive] = useState(false);
  const [instrumentData, setInstrumentData] = useState(undefined);
  const [videoUrl, setVideoUrl] = useState("");

  const [play, setPlay] = useState(0);
  const windowSize = useWindowSize();
  const { width } = windowSize;
  const mixerPad = 30;
  const logoContainerHeight = 44;

  const mixerWidth = (width || 0) - mixerPad * 2;
  const mixerHeight = (360 / 640) * mixerWidth;

  const videoRef = useRef(null);

  // Audio
  const [instruments, setInstruments] = useState({});

  const device =
    (width || 0) > 1100 ? "desktop" : (width || 0) > 678 ? "tablet" : "mobile";
  const instrumentSize = useMemo(
    () => (device === "mobile" ? 40 : 100),
    [device]
  );

  // NOTE: For desktop, we initialize web audio automatically
  useEffect(() => {
    if (device === "desktop") {
      Audio.initializeMasterGain();
      setAudioActive(true);
    }
  }, [device]);

  const processFiles = useCallback(
    async (insts) => {
      const spread = device === "desktop" ? 120 : device === "tablet" ? 35 : 20;

      if (!isNaN(mixerWidth)) {
        let allInstruments = {};
        for await (const [idx, inst] of insts.entries()) {
          const { name, key, url, start } = inst;
          await addAudioBuffer(Audio.context, url).then((buffer) => {
            allInstruments[key] = {
              name: name,
              startPosition: {
                left: spread * (idx + 1),
                top: mixerHeight / 2 - instrumentSize / 2,
              },
              panNode: undefined,
              gainNode: undefined,
              analyser: undefined,
              audioBuffer: buffer,
              start: start,
            };
          });
        }
        setInstruments(allInstruments);
      }
    },
    [mixerWidth, mixerHeight, instrumentSize, device]
  );

  // Load files from s3 (or local folder) and add them to buffer on initial render
  useEffect(() => {
    if (windowSize) {
      fetch(getFilesEndpoint, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      })
        .then((response) => response.json())
        .then((data) => {
          setInstrumentData(data.instruments);
          setVideoUrl(data.video);
        });
    }
  }, [windowSize]);

  useEffect(() => {
    if (audioActive && instrumentData) {
      processFiles(instrumentData);
    }
  }, [instrumentData, audioActive, processFiles]);

  const playAll = () => {
    const allInstruments = {};

    for (const [key, instrument] of Object.entries(instruments)) {
      const [panNode, gainNode, analyser] = playBuffer(
        Audio.context,
        Audio.masterGainNode,
        instrument.audioBuffer,
        instrument.start
      ); // TODO: Define a specific time for each sample

      allInstruments[key] = {
        ...instrument,
        panNode: panNode,
        gainNode: gainNode,
        analyser: analyser,
      };
    }

    setInstruments(allInstruments);
  };

  const pauseAll = () => Audio.context.suspend();
  const resumeAll = () => Audio.context.resume();

  const handleStripeModalClose = () => {
    setDisplayForm(false);
  };

  return (
    <Container>
      <LogoContainer logoContainerHeight={logoContainerHeight}>
        <ArrowContainer>
          <ArrowText>Drag icons ← and → for panning.</ArrowText>
          <ArrowText>Drag icons ↑ and ↓ for levels </ArrowText>
        </ArrowContainer>
      </LogoContainer>
      {!isNaN(mixerHeight) && !isNaN(mixerWidth) && (
        <MixerContainer
          height={mixerHeight}
          width={mixerWidth}
          mixerPad={mixerPad}
        >
          {videoUrl && (
            <Video
              ref={videoRef}
              height={mixerHeight - 2} // Adjustment to see border
              width={mixerWidth}
              logoContainerHeight={logoContainerHeight + 1}
              marginPad={mixerPad}
              muted
              playsInline
              loop
              src={videoUrl}
            />
          )}
          <Mask
            height={mixerHeight}
            width={mixerWidth}
            mixerPad={mixerPad}
            src={mask}
            logoContainerHeight={logoContainerHeight + 1}
            marginPad={mixerPad}
          />

          {Object.entries(instruments).map(([key, instrument], idx) => {
            // NOTE: math needed because limit depends on the starting position.
            const instrumentLimits = {
              rightLimit: mixerWidth - (idx + 1) * instrumentSize,
              leftLimit: 0 - idx * instrumentSize,
              topLimit: 0,
              bottomLimit: mixerHeight - instrumentSize,
              leftOffset: idx * instrumentSize, // NOTE: To calculate absolute position in the container.
            };

            return (
              <InstrumentComponent
                key={key}
                name={instrument.name}
                startPosition={instrument.startPosition}
                height={instrumentSize}
                width={instrumentSize}
                limits={instrumentLimits}
                panControl={instrument.panNode}
                gainControl={instrument.gainNode}
                analyser={instrument.analyser}
                audioContext={Audio.context}
                mixerWidth={mixerWidth}
                mixerHeight={mixerHeight}
              />
            );
          })}
        </MixerContainer>
      )}

      <ButtonsContainer mobile={device === "mobile"}>
        <Button
          onClick={() => {
            if (play === 0) {
              videoRef && videoRef.current && videoRef.current.play();
              playAll();
            } else if (play % 2 === 0) {
              videoRef && videoRef.current && videoRef.current.play();
              resumeAll();
            } else {
              videoRef && videoRef.current && videoRef.current.pause();
              pauseAll();
            }
            setPlay(play + 1);
          }}
        >
          {play % 2 === 0 ? "Play" : "Pause"}
        </Button>
        <Button onClick={() => setDisplayForm(true)}>Donate</Button>
      </ButtonsContainer>
      <Modal show={displayDialog} centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            The Alienation Dance
            <h6>An Interactive Music Experience by Rafart</h6>
          </Modal.Title>
        </Modal.Header>
        {!audioActive && (
          <Modal.Body>
            <p>Please activate your audio</p>
            <Button
              onClick={() => {
                // Mobile devices require manual initialization of web audio
                Audio.initializeMasterGain();
                setAudioActive(true);
              }}
            >
              Activate Audio
            </Button>
          </Modal.Body>
        )}
        {audioActive && (
          <>
            <Modal.Body>
              <p>
                For a better experience wear <strong>headphones</strong>, and
                use <strong>Chrome</strong> on a{" "}
                <strong>Desktop computer</strong>.
              </p>
              <h6>
                <strong>Support</strong>
              </h6>
              <p>
                Please support this project by clicking on the{" "}
                <strong>Donate</strong> button on the next screen. All
                transactions are encrypted and powered by Stripe.{" "}
              </p>
              <h6>
                <strong>Acknowledgements</strong>
              </h6>
              <p>
                This project is part of The Great Refusal, a live music
                experience funded by the Live Arts Boston 2020 grant by the
                Boston Foundation.
              </p>
              <br />
              <p>Thanks and enjoy! - Rafart</p>
            </Modal.Body>
            <Modal.Footer>
              {(isEmpty(instruments) || !videoUrl) && (
                <>
                  Files loading, please wait <Spinner animation="border" />
                </>
              )}
              <Button
                onClick={() => {
                  setDisplayDialog(false);
                  videoRef && videoRef.current && videoRef.current.play();
                  playAll();
                  setPlay(play + 1);
                }}
                disabled={isEmpty(instruments) || !videoUrl}
              >
                Start the experience
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <StripeModal open={displayForm} handleClose={handleStripeModalClose} />
    </Container>
  );
};

export default AlienationDance;
