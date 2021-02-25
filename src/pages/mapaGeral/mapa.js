import React, { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import {LayersControl, MapContainer, Marker, Popup, TileLayer, Polyline} from "react-leaflet";
import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../App.css'

import Demo from "./myPolyline"

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function MAPA({ dados ,polyline, makers, centerMap }) {

    const blackOptions = { color: 'black' }

    const [map, setMap] = useState(null);

    useEffect(() => {
      map?.setView(centerMap, 12 )
    }, [centerMap])


    useEffect(() => {
      if(!polyline.length) return 
      new Demo(map, 'speed').loadData(dados);
    }, [polyline])
  
  return (
      <MapContainer
        whenCreated={(ref) => { setMap(ref); }}
        style={{width:"100%", height:"97vh"}} center={centerMap} zoom={13} scrollWheelZoom={true}>
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

          {
            makers.length && (
              <Marker key={0} position={makers}>
                <Popup>
                {makers.join(", ")}
                </Popup>
              </Marker>
            )
          }

        <Polyline pathOptions={blackOptions} positions={polyline} />
        
      </MapContainer>
  );
}

export default MAPA;
