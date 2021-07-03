import React, {useState} from 'react';
import styled from 'styled-components';

import stickImage from 'assets/Stick.png';
import guitarImage from 'assets/Guitar.png';
import synthImage from 'assets/Synth.png';
import padImage from 'assets/Pad.png';
import voxImage from 'assets/Vox.png';
import bassImage from 'assets/Bass.png';
import fxImage from 'assets/Fx.png';

const Instrument = styled.img`
    height: ${props => `${props.height}`}px;
    width: ${props => `${props.width}`}px;
    border-radius: 50%; 
    border: 1px solid gray;
    position: absolute;
    top: ${props => `${props.position.top}px`};
    left: ${props => `${props.position.left}px`};
    cursor: pointer;
    z-index: 100;
`;

const instrumentImages = {
    Stick: stickImage,
    Guitars: guitarImage,
    Bass: bassImage,
    Synths: synthImage,
    FX: fxImage,
    Drums: padImage,
    Vox: voxImage,
}

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

    // console.log('pan', pan, 'gain', gain)
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

    const onDragStart = e => {
        // NOTE: Trick to remove the drag ghost image
        e.dataTransfer.setDragImage(e.target, window.outerWidth, window.outerHeight);
    }
    const onDragOrDrop = e => {
        const newLeft = Number(e.clientX);
        const newTop = Number(e.clientY);

        // NOTE: if-statement is a temporary solution to avoid audio discontinuity when mouse moves too quickly.
        if (Math.abs(newLeft - position.left) <= 120 && Math.abs(newTop - position.top) <= 120) {
            const positionInContainer = inContainer(
                {left: newLeft, top: newTop},
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

    }
    
    const image = instrumentImages[name];

    return(
        <Instrument 
            src={image}
            onDrag={onDragOrDrop}
            onDragStart={onDragStart} // Note: Remove ghost image
            onDragEnd={onDragOrDrop}
            position={position}
            height={height}
            width={width}
            draggable
        />
    );
};

export default InstrumentComponent;