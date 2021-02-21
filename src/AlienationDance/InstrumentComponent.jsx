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
const InstrumentComponent = ({
    name, 
    startPosition, 
    height, 
    width,
    limits,
}) => {
    const [position, setPosition] = useState({top: startPosition.top, left: startPosition.left});

    const onDragOrDrop = e => {
        setPosition(
            inContainer(
                {left: Number(e.clientX), top: Number(e.clientY)}, 
                height,
                width,
                limits,
            )
        )
    }

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