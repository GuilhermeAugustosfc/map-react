import React, {useEffect, useState, useRef} from 'react'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapbox.css'
 
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbGhlcm1lYXVndXN0byIsImEiOiJja2xpcTFleTMwMTE2MnZta3pvcHdjbHp4In0.qVZx9Pn6vmQkCWRldI7AXQ'; 


function Mapbox() {
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
             
        });

        
    }, []);

 

    return (
        <div>   
            <div className="map-container" ref={mapContainer} />
        </div>
    );
}

export default Mapbox;

// map.on('load', async function () {

//     let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/kmz/118z18onond7713j617j6s6j738fao3a18ann7sn177jzad78-pt-br.json");
//     let geojson = await retorno.json(); 

//     map.addSource('fazenda', {
//         'type': 'geojson',
//         'data': geojson
//     });
//     map.addLayer({
//         'id': 'fazenda',
//         'type': 'line',
//         'source': 'fazenda',
//         'layout': {
//             'line-join': 'round',
//             'line-cap': 'round'
//         },
//         'paint': {
//             'line-color': '#888',
//             'line-width': 1
//         }
//         });
// });

// map.on('move', () => {
//     setLng(map.getCenter().lng.toFixed(4));
//     setLat(map.getCenter().lat.toFixed(4));
//     setZoom(map.getZoom().toFixed(2));
//     console.log(1);
// });

// return () => map.remove();




// function handleKitten(e) {
//     e.target.style.backgroundImage = 'url(http://placekitten.com/g/50/50)';
//     e.stopPropagation();
// }

// function handleMapClick(e) {
//     console.log('handleMapClick', e);
//     map.off('cl ick', handleMapClick.bind(this));
// }

// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v9',
//     center: [-65.017, -16.457],
//     zoom: 5
// });

// var el = document.createElement('div');
// el.style.backgroundImage = 'url(https://placekitten.com/g/40/40/)';
// el.style.width = 40 + 'px';
// el.style.height = 40 + 'px';

// new mapboxgl.Marker(el)
//     .setLngLat([-63.29223632812499, -18.28151823530889])
//     .addTo(map);

// // el.addEventListener('click', handleKitten, false);
// map.on('click', handleMapClick.bind(el));


// ANIMACAO
// map.jumpTo({ 'center': coordinates[0], 'zoom': 17 });
// map.setPitch(30);

// // on a regular basis, add more coordinates from the saved list and update the map
// var i = 0;
// var timer = window.setInterval(function () {
//     if (i < coordinates.length) {
//         geojson.features[79].geometry.coordinates.push(
//             coordinates[i]
//         );
//         map.getSource('fazenda').setData(geojson);
//         map.panTo(coordinates[i]);
//         i++;
//     } else {
//         window.clearInterval(timer);
//     }
// }, 10);


// SETINHA NAS LINHAS


 // map.addLayer({
//   id: 'routearrows',
//   type: 'symbol',
//   source: 'rota',
//   layout: {
//     'symbol-placement': 'line',
//     'text-field': '▶',
//     'text-size': [
//       "interpolate",
//       ["linear"],
//       ["zoom"],
//       12, 24,
//       22, 60
//     ],
//     'symbol-spacing': [
//       "interpolate",
//       ["linear"],
//       ["zoom"],
//       12, 30,
//       22, 160
//     ],
//     'text-keep-upright': false
//   },
//   paint: {
//     'text-color': '#3887be',
//     'text-halo-color': 'yellow',
//     'text-halo-width': 1
//   }
// }, 'rota');



  // map.addLayer({
    //   'id': 'sky',
    //   'type': 'sky',
    //   'paint': {
    //     'sky-type': 'atmosphere',
    //     'sky-atmosphere-sun': [0.0, 0.0],
    //     'sky-atmosphere-sun-intensity': 15
    //   }
    // });










