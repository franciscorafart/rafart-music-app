import React, {useState} from 'react';
import styled from 'styled-components';

const Instrument = styled.div`
    height: 100px;
    width: 100px;
    display: block;
    border: 1px solid black;
    position: absolute;
    top: ${props => `${props.position.top}px`};
    left: ${props => `${props.position.left}px`};
    cursor: pointer;
`;

const InstrumentComponent = ({name, startPosition}) => {
    const [position, setPosition] = useState({top: startPosition.top, left: startPosition.left});

    const onDrag = e => {
        console.log('e', e)
        setPosition({left: Number(e.clientX), top: Number(e.clientY)})
    }

    const onDrop = e => {
        console.log('drop e', e)
        setPosition({left: Number(e.clientX), top: Number(e.clientY)})
    }
    return(
        <Instrument onDrag={onDrag} onDragEnd={onDrop} position={position}>{name}</Instrument>
    );
};

export default InstrumentComponent;