import React, {useState} from 'react';
import styled from 'styled-components';

const Instrument = styled.div`
    height: ${props => `${props.height}`}px;
    width: ${props => `${props.width}`}px;;
    border: 1px solid red;
    color: red;
    position: absolute;
    top: ${props => `${props.position.top}px`};
    left: ${props => `${props.position.left}px`};
    cursor: pointer;
    z-index: 100;
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
    // TODO: Fix math to make numbers exact
    const mixerWidth = limits.rightLimit - limits.leftLimit;
    const mixerHeight = limits.bottomLimit - limits.topLimit;
    const pan = parseFloat((((position.left - limits.leftLimit - (width/2)) / mixerWidth) * 2) - 1);
    const gain = parseFloat((((position.top - limits.topLimit - (height/2)) / mixerHeight) * -1) + 1);

    console.log('pan', pan, 'gain', gain)
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
    audioContext,
}) => {
    const [position, setPosition] = useState({top: startPosition.top, left: startPosition.left});

    const onDragOrDrop = e => {
        const positionInContainer = inContainer(
            {left: Number(e.clientX), top: Number(e.clientY)}, 
            height,
            width,
            limits,
        );

        setPosition(positionInContainer);
        
        const [pan, gain] = positionToPanGainTuple(positionInContainer, width, height, limits);
        
        // TODO: Can I get the audio context in a cleaner way?
        if (panControl){
            panControl.pan.setValueAtTime(pan, audioContext.currentTime);
        }
        
        if (gainControl) {
            gainControl.gain.setValueAtTime(gain, audioContext.currentTime);
        }
    }

    return(
        <Instrument 
            onDrag={onDragOrDrop} 
            onDragEnd={onDragOrDrop}
            position={position}
            height={height}
            width={width}
            draggable
        >{name}</Instrument>
    );
};

export default InstrumentComponent;