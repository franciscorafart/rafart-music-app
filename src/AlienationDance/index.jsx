import React, {useEffect, useState} from 'react';
import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import Audio from './AudioEngine';
import styled from 'styled-components';

import file from 'assets/jarmasti.mp3'

const MixerContainer = styled.div`
    margin: 30px 30px 30px 30px;
    width: ${props => `${props.width - 60}px`};
    height: ${props => `${props.height - 60}px`};
    border: 1px solid gray;
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
    const {width, height} = windowSize;

    const limits = {
        rightLimit: width - 30,
        leftLimit: 30,
        topLimit: 30,
        bottomLimit: height - 30,
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
    }
    // TODO: Enable play only when buffers are loaded
    console.log('audioBuffers', audioBuffers)

    return(
        <div>
            <MixerContainer height={height} width={width}>
                {Object.entries(instruments).map(([key, instrument]) => 
                    <InstrumentComponent
                        key={key}
                        name={instrument.name}
                        startPosition={instrument.startPosition}
                        height={50} 
                        width={50} 
                        limits={limits}
                        panControl={instrument.panNode}
                        gainControl={instrument.gainNode}
                        audioContext={Audio.context}
                    />
                )}
            </MixerContainer>
            <buton onClick={() => playAll()}>Play!</buton>
        </div>
    )
};

export default AlienationDance;