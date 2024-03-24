import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

import stickImage from "assets/Stick.png";
import guitarImage from "assets/Guitar.png";
import synthImage from "assets/Synth.png";
import padImage from "assets/Pad.png";
import voxImage from "assets/Vox.png";

const Instrument = styled.img`
  border-radius: 50%;
  border: 1px solid gray;
  pointer-events: none;
  background-color: ${(props) => `rgb(180, 200, 180, ${props.animation})`};
`;

const InstrumentWrapper = styled.div`
  height: ${(props) => `${props.height}`}px;
  width: ${(props) => `${props.width}`}px;
  cursor: move;
  z-index: 200;
  float: left;
`;

const instrumentImages = {
  Stick: stickImage,
  Guitars: guitarImage,
  Synth: synthImage,
  Drums: padImage,
  Vox: voxImage,
};

const positionToPanGainTuple = (
  position,
  width,
  height,
  mixerWidth,
  mixerHeight
) => {
  const pan = parseFloat((position.left / (mixerWidth - width)) * 2 - 1);
  const gain = parseFloat((position.top / (mixerHeight - height)) * -1 + 1);

  return [pan, gain];
};

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
  mixerWidth,
  mixerHeight,
}) => {
  const [animation, setAnimation] = useState(0);

  // Analyser
  const bufferLength = useMemo(
    () => (analyser ? analyser.frequencyBinCount : 0),
    [analyser]
  );

  useEffect(() => {
    const timerID = setInterval(() => tick(), 100);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    // Animation followS amplitude of original signal and scale it from 0 to 1.
    const dataArray = new Float32Array(bufferLength);
    if (analyser) {
      analyser.getFloatTimeDomainData(dataArray);
    }

    const energy =
      dataArray.length > 0
        ? Math.min(
            (dataArray.reduce((acc, current) => acc + Math.abs(current), 0) /
              dataArray.length) *
              20,
            1
          )
        : 0;

    setAnimation(energy);
  }

  const onDrag = (_, d) => {
    // Absolute position for mixer considering left offset
    const absolutePosition = { left: d.x + limits.leftOffset, top: d.y };

    const [pan, gain] = positionToPanGainTuple(
      absolutePosition,
      width,
      height,
      mixerWidth,
      mixerHeight
    );

    // TODO: Can I get the audio context in a cleaner way?
    if (panControl) {
      panControl.pan.setValueAtTime(pan, audioContext.currentTime);
    }

    if (gainControl) {
      gainControl.gain.setValueAtTime(gain, audioContext.currentTime);
    }
  };

  const image = instrumentImages[name];

  return (
    <Draggable
      axis="both"
      defaultPosition={{ x: startPosition.left, y: startPosition.top }}
      onDrag={onDrag}
      bounds={{
        left: limits.leftLimit,
        top: limits.topLimit,
        right: limits.rightLimit,
        bottom: limits.bottomLimit,
      }}
    >
      <InstrumentWrapper height={height} width={width}>
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
