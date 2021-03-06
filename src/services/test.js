import React, { useEffect, useState, useRef } from 'react'

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

// function onStyleData(map, Ct) {
//     if (Ct && Ct.style.stylesheet && Ct.style.stylesheet.owner === "mapbox-map-design" && !map.getSource('mapbox-dem')) {
//       map.addSource('mapbox-dem', {
//         'type': 'raster-dem',
//         'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
//         'tileSize': 512,
//         'maxzoom': 14
//       });
//       // add the DEM source as a terrain layer with exaggerated height
//       map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
//     }
//   }


// function onMouseOverFeature(e, map) {

//     var features = map.queryRenderedFeatures(e.point);
//     var displayProperties = [
//       'id',
//       'layer',
//       'source',
//       'sourceLayer',
//       'state',
//       'properties',
//       'geometry'
//     ];


//     var displayFeatures = features.map(function (feat) {
//       let displayFeat = {};

//       displayProperties.forEach(function (prop) {
//         displayFeat[prop] = feat[prop];
//       });
//       return displayFeat;
//     });

//     if (displayFeatures.length && ['rota'].includes(displayFeatures[0].source)) {
//       if (popups.length > 0) {
//         for (var i in popups) {
//           popups[i].remove();
//         }
//         popups = [];
//       }

//       let popup = new mapboxgl.Popup()
//         .setLngLat(e.lngLat)
//         .setHTML(templatePopup(displayFeatures[0].properties))
//         .addTo(map);

//       popups.push(popup)
//     }
//   }

// map.on('load', async function () {

//     let retorno = await fetch("https://fulltrackstatic.s3-sa-east-1.amazonaws.com/talhao/3o]te(c[-3-est(ofl5)cO3u44r3tieolnilogc20uotv.json");
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


// CALCULAR AREA DA CERCA


// if (cercaConsolidado) {
//   console.log(Math.round(turf.area(cercaConsolidado) * 100) / 100 + " Area Total");
// }

  // CASO FOR MONTAR A LINHA COMO POLYGON (VER O TANTO QUE FOI FEITO NO TALHAO)

    // let cercaRotaAtual = {
    //   'type': 'FeatureCollection',
    //   'features': [
    //     {
    //       'type': 'Feature',
    //       'geometry': {
    //         'type': 'Polygon',
    //         'coordinates': [posicoes]
    //       }
    //     },
    //   ]
    // }

    // console.log(Math.round(turf.area(cercaRotaAtual) * 100) / 100 + " Area percorrida");

    // map.addSource('rota', {
    //   'type': 'geojson',
    //   'data': cercaRotaAtual,
    // });

    // map.addLayer({
    //   'id': 'rota',
    //   'type': 'fill',
    //   'source': 'rota',
    //   'layout': {},
    //   'paint': {
    //     'fill-color': 'red',
    //     // 'fill-opacity':0.7,
    //     'fill-antialias' : true,
    //   }
    // });



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


// IMPORTAR CAMADAS MAPBOX
// import StylesControl from 'mapbox-gl-controls/lib/styles';

// map.addControl(new StylesControl({
//     styles: [
//         {
//             label: 'Streets',
//             styleName: 'Mapbox Streets',
//             styleUrl: 'mapbox://styles/mapbox/streets-v9',
//         },
//         {
//             label: 'Satellite',
//             styleName: 'Satellite',
//             styleUrl: 'mapbox://styles/mapbox/satellite-v9',

//         },
//         {
//             label: 'Terreno',
//             styleName: 'Terreno',
//             styleUrl: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
//         },
//     ],
// }), 'top-left');


// import MapboxDraw from "@mapbox/mapbox-gl-draw";

// ADD DRAW NO MAPA (CRIAÇÃO DE CERCA, AMRMER, REGUA)
// draw = new MapboxDraw({
//     displayControlsDefault: false,
//     controls: {
//         polygon: true,
//         trash: true
//     },
// })

// map.addControl(draw, 'top-left');






