import React, { useEffect, useRef } from 'react';
import L, {Map as LeafletMap} from 'leaflet';
import { TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

// Importing images from locally stored assets to address a bug
// in CodeSandbox: https://github.com/codesandbox/codesandbox-client/issues/3845


// When importing into your own app outside of CodeSandbox, you can import directly
// from the leaflet package like below
//
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

function App() {
  const mapRef = useRef();

  useEffect(async() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    if ( !map ) return;
    let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/kmz/118z18onond7713j617j6s6j738fao3a18ann7sn177jzad78-pt-br.json")
    let geojson = await retorno.json();
    const parksGeoJson = new L.GeoJSON(geojson, {
      onEachFeature: (feature = {}, layer) => {
        const { properties = {} } = feature;
        const { Name } = properties;

        if ( !Name ) return;

        layer.bindPopup(`<p>${Name}</p>`);
      }
    });

    parksGeoJson.addTo(map);
  }, [])

  return (
    <div className="App">
      <LeafletMap ref={mapRef} center={[39.50, -98.35]} zoom={4}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
        
      </LeafletMap>
    </div>
  );
}

export default App;
