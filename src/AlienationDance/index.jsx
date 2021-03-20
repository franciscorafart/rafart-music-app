import React, {useEffect, useState} from 'react';
import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import Audio from './AudioEngine';
import styled from 'styled-components';

import file from 'assets/jarmasti.mp3'

const MixerContainer = styled.div`
    margin: ${props => props.mixerPad}px 0 0 ${props => props.mixerPad}px;
    width: ${props => `${props.width}px`};
    height: ${props => `${props.height}px`};
    border: 1px solid black;
`;

const IFrame = styled.iframe`
    pointer-events: none;
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

        // TODO: Add video playback control here
    }
    // TODO: Enable play only when buffers are loaded
    console.log('audioBuffers', audioBuffers)

    return(
        <div>
            <MixerContainer height={mixerHeight} width={mixerWidth} mixerPad={mixerPad}>
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
                <IFrame
                    src="https://player.vimeo.com/video/494283475" 
                    width={mixerWidth} height={mixerHeight} 
                    frameborder="0" 
                    allow="fullscreen; picture-in-picture" 
                    allowfullscreen
                />
            </MixerContainer>
            <buton onClick={() => playAll()}>Play!</buton>
        </div>
    )
};

export default AlienationDance;