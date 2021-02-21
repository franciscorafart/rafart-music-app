import React from 'react';
import InstrumentComponent from './InstrumentComponent';
import useWindowSize from 'utils/hooks/useWindowSize';
import styled from 'styled-components';

const MixerContainer = styled.div`
    margin: 30px 30px 30px 30px;
    width: ${props => `${props.width - 60}px`};
    height: ${props => `${props.height - 60}px`};
    border: 1px solid gray;
`;

const AlienationDance = () => {
    const windowSize = useWindowSize();
    const {width, height} = windowSize;

    const limits = {
        rightLimit: width - 30,
        leftLimit: 30,
        topLimit: 30,
        bottomLimit: height - 30,
    }

    return(
        <div>
            <MixerContainer height={height} width={width}>
                <InstrumentComponent name='The Stick' startPosition={{left: 100, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Drums' startPosition={{left: 200, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Synths' startPosition={{left: 300, top: 100}} height={50} width={50} limits={limits}/>
                <InstrumentComponent name='Guitar' startPosition={{left: 400, top: 100}} height={50} width={50} limits={limits}/>
            </MixerContainer>
        </div>
    )
};

export default AlienationDance;