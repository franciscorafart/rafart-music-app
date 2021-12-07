import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import {isEmpty} from 'lodash';

import "bootstrap/dist/css/bootstrap.min.css";

import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import Audio from './AudioEngine';
import StripeModal from 'StripeModal';
import styled from 'styled-components';

import {addAudioBuffer, playBuffer} from './audioUtils';

// Files
import logoImage  from 'assets/logo.png';
import mask from 'assets/Mask.png'

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
    height: ${props => `${props.logoContainerHeight}px`};
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
    row-gap: 5px;
`;

const MixerContainer = styled.div`
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    padding: 20px 0 20px 0;
    gap: ${props => props.mobile ? '10px' : '0'}
`;

const Video = styled.video`
    position: absolute;
    top: ${props => `${props.logoContainerHeight}px`};
    left: ${props => `${props.marginPad}px`};
`;

const Mask = styled.img`
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
    position: absolute;
    top: ${props => `${props.logoContainerHeight}px`};
    left: ${props => `${props.marginPad}px`};
`;

const isProduction = process.env.NODE_ENV === 'production';

const AlienationDance = () => {
    const [displayForm, setDisplayForm] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(true);
    const [audioActive, setAudioActive] = useState(false);
    const [instrumentData, setInstrumentData] = useState(undefined);

    const [play, setPlay] = useState(0);
    const windowSize = useWindowSize();
    const {width, _} = windowSize;
    const mixerPad = 30;
    const logoContainerHeight = 100;

    const mixerWidth = width - (mixerPad*2);
    const mixerHeight = (360/640) * mixerWidth;

    const videoRef = useRef(null);

    // Audio
    const [instruments, setInstruments] = useState({});

    const device = width > 1100 ? 'desktop' : width > 678 ? 'tablet': 'mobile';
    const instrumentSize = useMemo(() => device === 'mobile' ? 40 : 100, [device]);

    // NOTE: For desktop, we initialize web audio automatically
    useEffect(() => {
        if (device === 'desktop') {
            Audio.initializeMasterGain();
            setAudioActive(true);
        }
    }, [device]);

    const processFiles = useCallback(async (insts) => {
        const spread = device === 'desktop' ? 120 : device === 'tablet'? 35 : 20;

        if (!isNaN(mixerWidth)) {
            let allInstruments = {};
            for await (const [idx, inst] of insts.entries()) {
                const {name, key, url, start} = inst;
                await addAudioBuffer(Audio.context, url).then(buffer => {
                    allInstruments[key] = {
                        name: name,
                        startPosition: {left: spread*(idx+1), top: ((mixerHeight/2) - (instrumentSize/2))},
                        panNode: undefined,
                        gainNode: undefined,
                        analyser: undefined,
                        audioBuffer: buffer,
                        start: start,
                    }
                });
            }
            setInstruments(allInstruments);
        }

    }, [mixerWidth, mixerHeight, instrumentSize, device]);

    // Load files from s3 (or local folder) and add them to buffer on initial render
    useEffect(() => {
        if (windowSize) {
            if (isProduction) {
                fetch('/get_audio_files', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                })
                .then((response) => response.json())
                .then((data) => {
                    setInstrumentData(data.instruments);
                });
            // }
            } else {
                (async () => {
                    const synthFile = await import('assets/synth.mp3');
                    const stickFile = await import('assets/stick.mp3');
                    const drumFile = await import('assets/drums.mp3');
                    const vox = await import('assets/vox.mp3');
                    const guitars = await import('assets/guitar.mp3');

                    setInstrumentData([
                        {name: 'Synth', key: 'synth', url: synthFile.default, 'start': 0},
                        {name: 'Stick', key: 'stick', url: stickFile.default, 'start': 0},
                        {name: 'Drums', key: 'drums', url: drumFile.default, 'start': 0},
                        {name: 'Vox', key: 'vox', url: vox.default, 'start': 0},
                        {name: 'Guitars', key: 'guitar', url: guitars.default, 'start': 0},
                    ]);
                })();
            }
        }
    }, [windowSize, device]);

    useEffect(() => {
        if (audioActive && instrumentData) {
            processFiles(instrumentData);
        }
    }, [instrumentData, audioActive, processFiles]);

    const playAll = () => {
        const allInstruments = {}

        for (const [key, instrument] of Object.entries(instruments)){
            const [panNode, gainNode, analyser] = playBuffer(
                Audio.context,
                Audio.masterGainNode,
                instrument.audioBuffer,
                instrument.start,
            ); // TODO: Define a specific time for each sample

            allInstruments[key] = {
                ...instrument,
                panNode: panNode,
                gainNode: gainNode,
                analyser: analyser,
            }
        }

        setInstruments(allInstruments);
    };

    const pauseAll = () => Audio.context.suspend();
    const resumeAll = () => Audio.context.resume();

    const handleStripeModalClose = () => {
        setDisplayForm(false);
    };

    return(
        <Container>
            <LogoContainer
                logoContainerHeight={logoContainerHeight}
            >
                <img
                    src={logoImage}
                    alt='Rafart logo'
                    width='200px'
                />
                <ArrowContainer>
                    <ArrowText>Drag icons ← and → for panning.</ArrowText>
                    <ArrowText>Drag icons ↑ and ↓ for levels </ArrowText>
                </ArrowContainer>
            </LogoContainer>
            {!isNaN(mixerHeight) && !isNaN(mixerWidth) && <MixerContainer height={mixerHeight} width={mixerWidth} mixerPad={mixerPad}>
                <Video
                    ref={videoRef}
                    height={mixerHeight-2} // Adjustment to see border
                    width={mixerWidth}
                    logoContainerHeight={logoContainerHeight+1}
                    marginPad={mixerPad}
                    muted
                    playsInline
                    loop
                    src='https://player.vimeo.com/external/544030006.hd.mp4?s=04cde03295c6b6cd31aede65f0c6d2ad0b3614ad&profile_id=175   '
                />
                <Mask
                    height={mixerHeight}
                    width={mixerWidth}
                    mixerPad={mixerPad}
                    src={mask}
                    logoContainerHeight={logoContainerHeight+1}
                    marginPad={mixerPad}
                />

                {Object.entries(instruments).map(([key, instrument], idx) => {
                    // NOTE: math needed because limit depends on the starting position.
                    const instrumentLimits = {
                        rightLimit: mixerWidth - ((idx+1)*instrumentSize),
                        leftLimit: 0 - (idx*instrumentSize),
                        topLimit: 0,
                        bottomLimit: mixerHeight - instrumentSize,
                        leftOffset: idx*instrumentSize, // NOTE: To calculate absolute position in the container.
                    }

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

            </MixerContainer>}

            <ButtonsContainer mobile={device === 'mobile'}>
                <Button
                    onClick={() => {
                        if (play === 0){
                            videoRef && videoRef.current && videoRef.current.play();
                            playAll();
                        } else if (play % 2 === 0) {
                            videoRef && videoRef.current && videoRef.current.play();
                            resumeAll();
                        } else {
                            videoRef && videoRef.current && videoRef.current.pause();
                            pauseAll();
                        }
                        setPlay(play + 1)
                    }
                }>{play % 2 === 0 ? 'Play' : 'Pause'}</Button>
                <Button
                    onClick={() => setDisplayForm(true)}
                >Donate</Button>
            </ButtonsContainer>
            <Modal
                show={displayDialog}
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        The Alienation Dance
                        <h6>An Interactive Music Experience by Rafart</h6>
                    </Modal.Title>
                </Modal.Header>
                {!audioActive && <Modal.Body>
                    <p>Please activate your audio</p>
                    <Button
                        onClick={() => {
                            // Mobile devices require manual initialization of web audio
                            Audio.initializeMasterGain();
                            setAudioActive(true);
                        }}
                    >Activate Audio</Button>
                </Modal.Body>}
                {audioActive && <>
                    <Modal.Body>
                        {/* <p>Alienation Dance is an interactive song built as a web application.</p> */}
                        {/* <h5>Make your own mix</h5>
                        <p>
                            Drag the icons Left and Right to <strong>pan</strong>, and
                            Up and Down to <strong>change volume.</strong>
                        </p> */}
                        <p>For a better experience <strong>wear headphones</strong> and use a<strong> Desktop computer.</strong></p>
                        <h6>Support</h6>
                        <p>Please support this project by clicking on the <strong>Donate</strong> button on the next screen. All transactions are encrypted and powered by Stripe. </p>
                        <h6>Acknowledgements</h6>
                        <p>This project is part of The Great Refusal, a live music experience funded by the Live Arts Boston 2020 grant by the Boston Foundation.</p>
                        <br/>
                        <p>Thanks and enjoy! - Rafart</p>
                    </Modal.Body>
                <Modal.Footer>
                    {isEmpty(instruments) && <Spinner animation="border" />}
                    <Button
                        onClick={() => {
                            setDisplayDialog(false);
                            videoRef && videoRef.current && videoRef.current.play();
                            playAll();
                            setPlay(play + 1)
                        }}
                        disabled={isEmpty(instruments)}
                    >Start the experience</Button>
                </Modal.Footer></>}
            </Modal>
            <StripeModal
                open={displayForm}
                handleClose={handleStripeModalClose}
            />
        </Container>
    )
};

export default AlienationDance;