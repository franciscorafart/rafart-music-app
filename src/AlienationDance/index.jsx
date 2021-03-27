import React, {useEffect, useRef, useState} from 'react';
import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import Audio from './AudioEngine';
import styled from 'styled-components';

import file from 'assets/jarmasti.mp3'
import vid from 'assets/AndesHazeNature.mp4';

const MixerContainer = styled.div`
    margin: ${props => props.mixerPad}px 0 0 ${props => props.mixerPad}px;
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
    border: 1px solid black;
`;

const Video = styled.video`
    z-index: -100;
`

const Button = styled.button`

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

    // TODO: return gain and panning controls so that the UI can manipulate them
    return [panNode, stemGainNode];
}

const initialInstrumentsState = {
    stick: {
        name: 'The Stick',
        startPosition: {left: 100, top: 100},
        panNode: undefined,
        gainNode: undefined,
    },
    drums: {
        name: 'Drums',
        startPosition: {left: 200, top: 100},
        panNode: undefined,
        gainNode: undefined,
    },
    synths: {
        name: 'Synth',
        startPosition: {left: 300, top: 100},
        panNode: undefined,
        gainNode: undefined,
    },
    guitar: {
        name: 'Guitar',
        startPosition: {left: 400, top: 100},
        panNode: undefined,
        gainNode: undefined,
    },
}

const AlienationDance = () => {
    const [play, setPlay] = useState(0);
    const windowSize = useWindowSize();
    const {width, _} = windowSize;
    const mixerPad = 30;

    const mixerWidth = width - (mixerPad*2);
    const mixerHeight = (360/640) * mixerWidth;
    const instrumentSize = 50;

    const limits = {
        rightLimit: width - mixerPad,
        leftLimit: mixerPad,
        topLimit: mixerPad,
        bottomLimit: mixerHeight + mixerPad,
    }

    const videoRef = useRef(null);

    // Audio
    const [audioBuffers, setAudioBuffers] = useState([]);
    const [instruments, setInstruments] = useState(initialInstrumentsState);

    const initializeMasterGain = () => {
        Audio.masterGainNode.connect(Audio.context.destination);
        Audio.masterGainNode.gain.setValueAtTime(1, Audio.context.currentTime);
    }

    useEffect(() => {
        initializeMasterGain();

        // TODO: Somehow load file based on instrument and add them all
        addAudioBuffer(Audio.context, file).then((tempBuffer => setAudioBuffers([...audioBuffers, tempBuffer])));
    }, []);

    const playAll = () => {
        for (const audioBuffer of audioBuffers){
            const [panNode, gainNode] = playBuffer(Audio.context, Audio.masterGainNode, audioBuffer, 0);
            // TODO: This is wrong, each instrument should have a file reference that's loaded and assigned here
            setInstruments({
                ...instruments,
                stick: {
                    ...instruments.stick,
                    panNode: panNode,
                    gainNode: gainNode,
                }
            })
        }
    };

    const pauseAll = () => Audio.context.suspend();
    const resumeAll = () => Audio.context.resume();
    
    // TODO: Enable play only when buffers are loaded
    console.log('audioBuffers', audioBuffers)

    const videoLink = './assets/AndesHazeNature.mp4'
    console.log(mixerWidth, mixerHeight)
    return(
        <div>
            {!isNaN(mixerHeight) && !isNaN(mixerWidth) && <MixerContainer height={mixerHeight} width={mixerWidth} mixerPad={mixerPad}>
                {Object.entries(instruments).map(([key, instrument]) => 
                    <InstrumentComponent
                        key={key}
                        name={instrument.name}
                        startPosition={instrument.startPosition}
                        height={instrumentSize}
                        width={instrumentSize}
                        limits={limits}
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
                    src={vid}
                />
            </MixerContainer>}
            <Button onClick={() => {
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
            }}>{play % 2 === 0 ? 'Play' : 'Pause'}</Button>
        </div>
    )
};

export default AlienationDance;