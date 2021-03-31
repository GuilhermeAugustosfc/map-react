import React, { forwardRef } from 'react'

import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    preserveDrawingBuffer:true
});

const Mapbox = forwardRef((props, refMap) => {

    return (
        <Map ref={refMap} {...props} />
    );

})

export default Mapbox