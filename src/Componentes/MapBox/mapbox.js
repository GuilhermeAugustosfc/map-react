import React, { forwardRef, useEffect } from 'react'

import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-controls/theme.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './mapbox.css'

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
});

const Mapbox = forwardRef((props, refMap) => {

    useEffect(() => {
        console.log(props);
        
    }, [props])
    return (
        <Map ref={refMap} {...props} />
    );

})

export default Mapbox