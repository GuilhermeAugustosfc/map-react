import React, { useEffect, useState } from 'react'
// import { MapContainer, LayersControl , Marker, Popup, TileLayer, Polyline, GeoJSON} from "react-leaflet";
import { MapContainer, LayersControl, TileLayer, Marker, Popup, Polyline, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../App.css'

import Demo from "./myPolyline"

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function MAPA({geojson, dados , polyline, makers, centerMap }) {

    const blackOptions = { color: 'black' }

    const [map, setMap] = useState(null);

    useEffect(() => {
      map?.setView(centerMap, 12 )
    }, [centerMap, map])


    useEffect(() => {
   
      if( polyline.length && map && geojson ) {
        const fazendaGeojson = new L.GeoJSON(geojson, {
          onEachFeature: (feature = {}, layer) => {
            const { properties = {} } = feature;
            const { Name } = properties;
    
            if ( !Name ) return;
    
            layer.bindPopup(`<p>${Name}</p>`);
          }
        });
    
        fazendaGeojson.addTo(map);
  
        // new Demo(map, 'speed').loadData(dados);
      } 
      

     
    }, [polyline, geojson, map, dados])
  
  return (
      <MapContainer
        whenCreated={(ref) => { setMap(ref); }}
        style={{width:"100%", height:"97vh"}} center={centerMap} zoom={20} scrollWheelZoom={true}>
        <LayersControl>
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

          {makers && makers.length && (
            <Marker key={0} position={makers}>
              <Popup>
              {makers.join(", ")}
              </Popup>
            </Marker>
          )}

        {/* <Polyline pathOptions={blackOptions} positions={polyline} /> */}
        
      </MapContainer>



    // <Map style={{width:"100%", height:"97vh"}} ref={ref} center={centerMap} scrollWheelZoom={true}>
    //   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
    //   { makers.length && (
    //       <Marker key={0} position={makers}>
    //         <Popup>
    //         {makers.join(", ")}
    //         </Popup>
    //       </Marker>
    //     )
    //   }

    //   <Polyline pathOptions={blackOptions} positions={polyline} />

    // </Map>

  );
}

export default MAPA;
