import React, {useState} from 'react';
import styled from 'styled-components';

const Instrument = styled.div`
    height: ${props => `${props.height}`}px;
    width: ${props => `${props.width}`}px;;
    display: block;
    border: 1px solid black;
    position: absolute;
    top: ${props => `${props.position.top}px`};
    left: ${props => `${props.position.left}px`};
    cursor: pointer;
`;

const inContainer = (
    position, 
    height, 
    width,
    limits,
) => {
    let horizontal = 0;
    if (position.left < limits.leftLimit){
        horizontal = limits.leftLimit
    } else if (position.left + width > limits.rightLimit) {
        horizontal = limits.rightLimit - width;
    } else {
        horizontal = position.left;
    }

    let vertical = 0;

    if (position.top < limits.topLimit) {
        vertical = limits.topLimit;
    } else if (position.top + height > limits.bottomLimit) {
        vertical = limits.bottomLimit - height;
    } else {
        vertical = position.top;
    }

    return {
        left: horizontal,
        top: vertical,
    }
}

const positionToPanGainTuple = (position, width, height, limits) => {
    
    const mixerWidth = limits.rightLimit - limits.leftLimit;
    const mixerHeight = limits.bottomLimit - limits.topLimit;
    console.log('position', position, 'mixerWidth', mixerWidth, 'mixerHeight', mixerHeight)
    const pan = (((position.left - limits.leftLimit - (width/2)) / mixerWidth) * 2) - 1;
    const gain = (((position.top - limits.topLimit - (height/2)) / mixerHeight) * -1) + 1;

    return [pan, gain]
}

const InstrumentComponent = ({
    name, 
    startPosition, 
    height, 
    width,
    limits,
    panControl,
    gainControl,
}) => {
    const [position, setPosition] = useState({top: startPosition.top, left: startPosition.left});
    const [pan, setPan] = useState(0);
    const [gain, setGain] = useState(0.5); // Starting position really

    const onDragOrDrop = e => {
        const positionInContainer = inContainer(
            {left: Number(e.clientX), top: Number(e.clientY)}, 
            height,
            width,
            limits,
        );

        setPosition(positionInContainer);
        
        const [pan, gain] = positionToPanGainTuple(positionInContainer, width, height, limits);
        // TODO: update panControl and gainControl with the current state. No need for state
        setPan(pan);
        setGain(gain);
    }

    console.log('pan', pan, 'gain', gain);
    

    return(
        <Instrument 
            onDrag={onDragOrDrop} 
            onDragEnd={onDragOrDrop}
            position={position}
            height={height}
            width={width}
        >{name}</Instrument>
    );
};

export default InstrumentComponent;