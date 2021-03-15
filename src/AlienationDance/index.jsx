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
    const stemGainNode = audioCtx.createGain();
    stemGainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    stemGainNode.connect(masterGainNode);

    const stemAudioSource = audioCtx.createBufferSource();
    stemAudioSource.buffer = buffer;

    stemAudioSource.connect(stemGainNode);
    stemAudioSource.start(time);

    // TODO: return gain and panning controls so that the UI can manipulate them
    return stemAudioSource;
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

    const initializeMasterGain = () => {
        Audio.masterGainNode.connect(Audio.context.destination);
        Audio.masterGainNode.gain.setValueAtTime(1, Audio.context.currentTime);
    }

    useEffect(() => {
        initializeMasterGain();

        addAudioBuffer(Audio.context, file).then((tempBuffer => setAudioBuffers([tempBuffer])));
    }, []);

    const playAll = () => {
        for (const audioBuffer of audioBuffers){
            playBuffer(Audio.context, Audio.masterGainNode, audioBuffer, 0);
        }
    }

    console.log('audioBuffers', audioBuffers)

    return(
        <div>
            <MixerContainer height={height} width={width}>
                <InstrumentComponent name='The Stick' startPosition={{left: 100, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Drums' startPosition={{left: 200, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Synths' startPosition={{left: 300, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Guitar' startPosition={{left: 400, top: 100}} height={50} width={50} limits={limits}/>
            </MixerContainer>
            <buton onClick={() => playAll()}>Play!</buton>
        </div>
    )
};

export default AlienationDance;