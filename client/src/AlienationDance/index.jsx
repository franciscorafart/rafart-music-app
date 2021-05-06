import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import "bootstrap/dist/css/bootstrap.min.css";


import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import Audio from './AudioEngine';
import StripeModal from './StripeModal';
import styled from 'styled-components';

// Files
import logoImage  from 'assets/logo.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const LogoContainer = styled.div`
    width: 200px;
`;

const MixerContainer = styled.div`
    margin: ${props => props.mixerPad}px 0 ${props => props.mixerPad}px 0;
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
    border: 1px solid white;
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

    // Singal chain
    stemAudioSource.connect(panNode);
    panNode.connect(stemGainNode);
    stemGainNode.connect(masterGainNode);

    stemAudioSource.start(time);

    // Return gain and panning controls so that the UI can manipulate them
    return [panNode, stemGainNode];
}

const AlienationDance = () => {
    const [displayForm, setDisplayForm] = useState(false);

    const isProduction = process.env.NODE_ENV === 'production';

    const [play, setPlay] = useState(0);
    const windowSize = useWindowSize();
    const {width, _} = windowSize;
    const mixerPad = 30;

    const mixerWidth = width - (mixerPad*2);
    const mixerHeight = (360/640) * mixerWidth;
    const instrumentSize = 50;

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
        for (const [idx, inst] of insts.entries()) {
            const {name, key, url} = inst;
            await addAudioBuffer(Audio.context, url).then(buffer => {
                allInstruments[key] = {
                    name: name,
                    startPosition: {left: 100*(idx+1), top: 100}, // TODO: Fix in correspondance with mix
                    panNode: undefined,
                    gainNode: undefined,
                    audioBuffer: buffer
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
                processFiles([
                    {name: 'Synth', key: 'synth', url: synthFile.default},
                    {name: 'Stick', key: 'stick', url: stickFile.default}
                ]);
            })();
        }
    }, [isProduction]);


    const playAll = () => {
        for (const [key, instrument] of Object.entries(instruments)){
            const [panNode, gainNode] = playBuffer(Audio.context, Audio.masterGainNode, instrument.audioBuffer, 0);

            setInstruments({
                ...instruments,
                [key]: {
                    ...instrument,
                    panNode: panNode,
                    gainNode: gainNode,
                }
            })
        }
    };

    const pauseAll = () => Audio.context.suspend();
    const resumeAll = () => Audio.context.resume();

    const handleStripeModalClose = () => {
        setDisplayForm(false);
    };

    return(
        <Container>
            <LogoContainer><img src={logoImage} width='200px'/></LogoContainer>
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
                        audioContext={Audio.context}
                    />
                )}
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
            <StripeModal 
                open={displayForm}
                handleClose={handleStripeModalClose}
            />
        </Container>
    )
};

export default AlienationDance;