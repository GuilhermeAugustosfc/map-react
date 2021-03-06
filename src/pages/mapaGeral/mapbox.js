import React, { useEffect, useState, forwardRef } from 'react'

import ReactMapboxGl, { Layer, Feature, MapContext } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1IjoiZ3VpbGhlcm1lYXVndXN0byIsImEiOiJja2x2cTBqNmwwdmJ4MnVwOXhoNGxlYXJhIn0.l3dDoihzDUhGs7wys4ty1g'
});

const Mapbox = forwardRef((props, refMap) => {
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        console.log(props, refMap);
    }, [props])

    return (
        <div>
            <Map ref={refMap} {...props} >
                <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                    <Feature coordinates={[-22.21537, -49.653947]} />
                </Layer>
            </Map>
        </div>
    );

})

export default Mapbox