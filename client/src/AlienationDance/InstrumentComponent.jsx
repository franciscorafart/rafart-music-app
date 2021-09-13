import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';

import stickImage from 'assets/Stick.png';
import guitarImage from 'assets/Guitar.png';
import synthImage from 'assets/Synth.png';
import padImage from 'assets/Pad.png';
import voxImage from 'assets/Vox.png';

const Instrument = styled.img`
    border-radius: 50%; 
    border: 1px solid gray;
    pointer-events: none;
    background-color: ${props => `rgb(180, 200, 180, ${props.animation})`};
`;

const InstrumentWrapper = styled.div`
    height: ${props => `${props.height}`}px;
    width: ${props => `${props.width}`}px;
    cursor: move;
    z-index: 100;
    float: left;
`;

const instrumentImages = {
    Stick: stickImage,
    Guitars: guitarImage,
    Synth: synthImage,
    Drums: padImage,
    Vox: voxImage,
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
    analyser,
    audioContext,
}) => {
    const [animation, setAnimation] = useState(0)

    // Analyser
    const bufferLength = useMemo(() => analyser ? analyser.frequencyBinCount : 0, [analyser]);

    useEffect(() => {
        const timerID = setInterval( () => tick(), 100);

        return function cleanup() {
            clearInterval(timerID);
        };
    });

   function tick() {
       // TODO: Make animation follow amplitude of original signal and scale it from 0 to 1.

       const dataArray = new Uint8Array(bufferLength);
       if(analyser) {
            analyser.getByteFrequencyData(dataArray); // NOTE: How could I get mean amplitude???
        }

       const mean = dataArray.length > 0 ? dataArray.reduce((acc, sum) => acc+sum, 0) / dataArray.length : 0;

       if (mean > 0) {
           animation > 0 ? setAnimation(0) : setAnimation(mean);
       } else {
           setAnimation(0);
       }
   }

    const onDrag = (_, d) => {
        console.log('x', d.x, 'y', d.y)

        // NOTE: if-statement is a temporary solution to avoid audio discontinuity when mouse moves too quickly.
        // if (Math.abs(newLeft - position.left) <= 120 && Math.abs(newTop - position.top) <= 120) {
            const position = {left: d.x, top: d.y};
            const [pan, gain] = positionToPanGainTuple(position, width, height, limits);

            // TODO: Can I get the audio context in a cleaner way?
            if (panControl){
                panControl.pan.setValueAtTime(pan, audioContext.currentTime);
            }

            if (gainControl) {
                gainControl.gain.setValueAtTime(gain, audioContext.currentTime);
            }
        // }
    }

    const image = instrumentImages[name];
    // console.log('start x', startPosition.left, 'start y', startPosition.top)
    return(
        <Draggable
            axis='both'
            defaultPosition={{x: startPosition.left, y: startPosition.top}}
            onDrag={onDrag}
            bounds={{
                left: limits.leftLimit, 
                top: limits.topLimit, 
                right: limits.rightLimit, 
                bottom: limits.bottomLimit,
            }}
        >
             <InstrumentWrapper 
                height={height}
                width={width}
                className='box'
            >
                <Instrument 
                    src={image}
                    animation={animation}
                    height={height}
                    width={width}
                />
             </InstrumentWrapper>
        </Draggable>
    );
};

export default InstrumentComponent;