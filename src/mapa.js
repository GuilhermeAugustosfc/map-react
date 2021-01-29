import React from 'react'
import {Circle, LayersControl, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function MAPA() {

  const center = [51.505, -0.09]
  const center1 = [55.505, -0.09]
  const center2 = [53.505, -0.09]
  const center3 = [52.505, -0.09]

  
  return (
      <MapContainer style={{width:"100%", height:"97vh"}} center={center} zoom={13} scrollWheelZoom={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Circle
          center={center}
          pathOptions={{ fillColor: 'blue' }}
          radius={1000}
        />
        
        <Marker position={center}>
            <Popup>
              Guilherme
            </Popup>
        </Marker>

        <Marker position={center1}>
            <Popup>
              Guilherme
            </Popup>
        </Marker>

        <Marker position={center2}>
            <Popup>
              Guilherme
            </Popup>
        </Marker>

        <Marker position={center3}>
            <Popup>
              Guilherme
            </Popup>
        </Marker>
      </MapContainer>
  );
}

export default MAPA;
