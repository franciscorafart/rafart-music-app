import React, {useState, useEffect} from 'react';
import InstrumentComponent from './InstrumentComponent';
import styled from 'styled-components';

const MixerContainer = styled.div`
    margin: 30px 30px 30px 30px;
    width: ${props => `${props.width - 60}px`};
    height: ${props => `${props.height - 60}px`};
    border: 1px solid gray;
`;

const AlienationDance = () => {
    const windowSize = useWindowSize();
    const height = windowSize.height;
    const width = windowSize.width;

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

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
  
    return windowSize;
  }

export default AlienationDance;