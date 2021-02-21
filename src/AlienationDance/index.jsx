import React from 'react';
import InstrumentComponent from './InstrumentComponent';
import styled from 'styled-components';

const MixerContainer = styled.div`
    margin: 100px 0 0 100px;
    width: 800px;
    height: 600px;
    border: 1px solid gray;
`;

const AlienationDance = () => {

    // TODO: Determine limits from size and position of Mixer Container
    const limits = {
        rightLimit: 900,
        leftLimit: 100,
        topLimit: 100,
        bottomLimit: 700,
    }

    return(
        <div>
            <MixerContainer>
                <InstrumentComponent name='The Stick' startPosition={{left: 100, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Drums' startPosition={{left: 200, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Synths' startPosition={{left: 300, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Guitar' startPosition={{left: 400, top: 100}} height={50} width={50} limits={limits}/>
            </MixerContainer>
        </div>
    )
};

export default AlienationDance;