import React from 'react';
import InstrumentComponent from './InstrumentComponent';

const AlienationDance = () => {

    return(
        <div>
            <InstrumentComponent name='The Stick' startPosition={{left: 100, top: 100}}/>
            <InstrumentComponent name='Drums' startPosition={{left: 200, top: 100}}/>
            <InstrumentComponent name='Synths' startPosition={{left: 300, top: 100}}/>
            <InstrumentComponent name='Guitar' startPosition={{left: 400, top: 100}}/>
        </div>
    )
};

export default AlienationDance;