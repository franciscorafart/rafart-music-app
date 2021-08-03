import React, {useEffect, useRef, useState} from 'react';
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

// Files
import logoImage  from 'assets/logo.png';
import mask from 'assets/Mask.png'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: black;
`;

const LogoContainer = styled.div`
    width: 200px;
`;

const MixerContainer = styled.div`
    margin: ${props => props.mixerPad}px 0 ${props => props.mixerPad}px 0;
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    padding: 20px 0 20px 0;
`;

const Video = styled.video`
    z-index: -100;
`;

const Mask = styled.img`
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
    z-index: 10;
    position: absolute;
`;

const isProduction = process.env.NODE_ENV === 'production';

const getFile = async (audioCtx, filepath) => {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    let audioBuffer;
    try {
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e){
        console.error(e)
    }

    return audioBuffer;
}

const addAudioBuffer = async (audioCtx, filepath) => {
    const buffer = await getFile(audioCtx, filepath);
    return buffer;
}

const playBuffer = (audioCtx, masterGainNode, buffer, time) => {
    const stemAudioSource = audioCtx.createBufferSource();
    stemAudioSource.buffer = buffer;

    const panNode = audioCtx.createStereoPanner();
    panNode.pan.setValueAtTime(0, audioCtx.currentTime);

    const stemGainNode = audioCtx.createGain();
    stemGainNode.gain.setValueAtTime(1, audioCtx.currentTime);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    // analyser.fftSize = 126;

    const bufferLength = analyser.frequencyBinCount;

    // NOTE: Maybe I don't need this here?
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Singal chain
    stemAudioSource.connect(analyser);
    analyser.connect(panNode);
    panNode.connect(stemGainNode);
    stemGainNode.connect(masterGainNode);

    stemAudioSource.start(time);

    // Return gain and panning controls so that the UI can manipulate them
    return [panNode, stemGainNode, analyser];
}

const AlienationDance = () => {
    const [displayForm, setDisplayForm] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(true);

    const [play, setPlay] = useState(0);
    const windowSize = useWindowSize();
    const {width, _} = windowSize;
    const mixerPad = 30;

    const mixerWidth = width - (mixerPad*2);
    const mixerHeight = (360/640) * mixerWidth;
    const instrumentSize = 100;

    const instrumentLimits = {
        rightLimit: width - mixerPad,
        leftLimit: mixerPad,
        topLimit: mixerPad,
        bottomLimit: mixerHeight + mixerPad,
    }

    const videoRef = useRef(null);

    // Audio
    const [instruments, setInstruments] = useState({});

    const initializeMasterGain = () => {
        Audio.masterGainNode.connect(Audio.context.destination);
        Audio.masterGainNode.gain.setValueAtTime(1, Audio.context.currentTime);
    }

    const processFiles = async (insts) => {

        let allInstruments = {};
        for await (const [idx, inst] of insts.entries()) {
            const {name, key, url, start} = inst;
            await addAudioBuffer(Audio.context, url).then(buffer => {
                allInstruments[key] = {
                    name: name,
                    startPosition: {left: 150*(idx+1), top: 300},
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

    // Load files from s3 (or local folder) and add them to buffer on initial render
    useEffect(() => {
        initializeMasterGain();

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
                const instrumentsBackend = data.instruments;
                processFiles(instrumentsBackend);
            });
        } else {
            (async () => {
                const synthFile = await import('assets/synth.mp3');
                const stickFile = await import('assets/stick.mp3');
                const drumFile = await import('assets/drums.mp3');
                const vox = await import('assets/vox.mp3');
                const guitars = await import('assets/guitar.mp3');

                processFiles([
                    {name: 'Synth', key: 'synth', url: synthFile.default, 'start': 0},
                    {name: 'Stick', key: 'stick', url: stickFile.default, 'start': 0},
                    {name: 'Drums', key: 'drums', url: drumFile.default, 'start': 0},
                    {name: 'Vox', key: 'vox', url: vox.default, 'start': 76.26163}, // Bar 35, first beat. 107bpm
                    {name: 'Guitars', key: 'guitar', url: guitars.default, 'start': 65.04667}, // Bar 30, first beat. 107bpm
                ]);
            })();
        }
    }, []);

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
            <LogoContainer><img src={logoImage} alt='Rafart logo' width='200px'/></LogoContainer>
            {!isNaN(mixerHeight) && !isNaN(mixerWidth) && <MixerContainer height={mixerHeight} width={mixerWidth} mixerPad={mixerPad}>
                {Object.entries(instruments).map(([key, instrument]) => 
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
                    />
                )}
                <Mask 
                    height={mixerHeight}
                    width={mixerWidth}
                    mixerPad={mixerPad}
                    src={mask} 
                />
                <Video
                    ref={videoRef}
                    height={mixerHeight}
                    width={mixerWidth}
                    muted
                    playsInline
                    loop
                    src='https://player.vimeo.com/external/544030006.hd.mp4?s=04cde03295c6b6cd31aede65f0c6d2ad0b3614ad&profile_id=175   '
                />
            </MixerContainer>}
            <ButtonsContainer>
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
                >Support this project</Button>
            </ButtonsContainer>
            <Modal
                show={displayDialog}
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Alienation Dance - Interactive Music Experience
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Alienation Dance is an interactive song released as web app musical experience.</p>
                    <p>You can live mix the song by dragging the instrument icons on the surface, panning left and right, and changing levels up and down</p>
                    
                    <p>Please support this project by clicking on the <strong>Donate</strong> button on the next screen. All transactions are encrypted and powered by Stripe. </p>

                    <p>This project is part of The Great Refusal, a live music experience funded by the Live Arts Boston 2020 grant by the Boston Foundation</p>

                    <p>Thanks and enjoy!</p>
                    <p>Rafart</p>
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
                </Modal.Footer>
            </Modal>
            <StripeModal 
                open={displayForm}
                handleClose={handleStripeModalClose}
            />
        </Container>
    )
};

export default AlienationDance;