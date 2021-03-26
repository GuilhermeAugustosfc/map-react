import React, { forwardRef } from 'react'

import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1IjoiZ3VpbGhlcm1lYXVndXN0byIsImEiOiJja2x2cTBqNmwwdmJ4MnVwOXhoNGxlYXJhIn0.l3dDoihzDUhGs7wys4ty1g'
});

const Mapbox = forwardRef((props, refMap) => {

    return (
        <Map ref={refMap} {...props} />
    );

})

export default Mapbox