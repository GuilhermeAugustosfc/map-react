import React, { useState } from 'react'

import MapBox from '../../Componentes/MapBox/mapbox';

import mapboxgl from 'mapbox-gl';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import * as turf from "@turf/turf"

import SocketFulltrack from '../../services/socket'

function Dashboard(props) {

    const [mapOptions, setMapOptions] = useState({
        center: [-49.654063, -22.215288],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: [15],
        // preserveDrawingBuffer: true,
        // style: "mapbox://styles/mapbox/streets-v9",
        containerStyle: {
            height: '100vh',
            width: '100vw'
        }
    })

    var sourceMarker = {};
    var sourceMarkerIndex = {};

    var imagesMarkers = [
        {
            url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-pt-br.png",
            nome: "marker-desligado"
        },
        {
            url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-es-es.png",
            nome: "marker-ligado"
        },
        {
            url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-en-us.png",
            nome: "marker-movimento"
        }
    ]

    function atualizarMarkerMapa(data, map, aux) {

        aux.coordenadas = [parseFloat(data.ras_eve_longitude), parseFloat(data.ras_eve_latitude)];
        if (sourceMarkerIndex.hasOwnProperty(data.ras_vei_id)) {
            aux.allFeaturesMarkers = map.getSource('markersSymbol')._data;
            aux.featureMarkerAtual = aux.allFeaturesMarkers.features[sourceMarkerIndex[data.ras_vei_id]];

            aux.featureMarkerAtual.geometry.coordinates = aux.coordenadas;
            aux.featureMarkerAtual.properties.image_marker = parseInt(data.ras_eve_ignicao) ? (parseInt(data.ras_eve_velocidade) > 0 ? 'marker-movimento' : 'marker-ligado') : 'marker-desligado';
            aux.featureMarkerAtual.properties.velocidade = data.ras_eve_velocidade;
            aux.featureMarkerAtual.properties.dt_gps = data.ras_eve_data_gps;
            aux.featureMarkerAtual.properties.desc_ativo = data.ras_vei_veiculo;
            aux.featureMarkerAtual.properties.ignicao = data.ras_eve_ignicao;

            aux.allFeaturesMarkers.features[sourceMarkerIndex[data.ras_vei_id]] = aux.featureMarkerAtual;

            map.getSource('markersSymbol').setData(aux.allFeaturesMarkers)

        } else {

            sourceMarkerIndex[data.ras_vei_id] = sourceMarker.features.length;
            sourceMarker.features.push(turf.point(aux.coordenadas, {
                image_marker: parseInt(data.ras_eve_ignicao) ? (parseInt(data.ras_eve_velocidade) > 0 ? 'marker-movimento' : 'marker-ligado') : 'marker-desligado',
                velocidade: data.ras_eve_velocidade,
                dt_gps: data.ras_eve_data_gps,
                desc_ativo: data.ras_vei_veiculo,
                ignicao: data.ras_eve_ignicao,
            }))

            map.getSource('markersSymbol').setData(sourceMarker)
        }
    }

    function onLoadMap(map) {

        // ADD CAMADA DOM MAPA
        map.addControl(new ZoomControl(), 'top-left');

        imagesMarkers.forEach(item => {
            map.loadImage(item.url, function (error, image) {
                map.addImage(item.nome, image)
            })
        });

        var aux = {
            coordenadas: [],
            allFeaturesMarkers: [],
            featureMarkerAtual: []
        }

        sourceMarker = {
            'type': 'FeatureCollection',
            'features': []
        }

        map.addSource('markersSymbol', {
            'type': 'geojson',
            'data': sourceMarker
        });

        map.addLayer({
            'id': 'markersSymbol',
            'type': 'symbol',
            'source': 'markersSymbol',
            'layout': {
                'icon-size': 1,
                'icon-image': ['get', 'image_marker'],
                'icon-allow-overlap': true,
                // get the title name from the source's "title" property
                'text-field': ['get', 'desc_ativo'],
                'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                ],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'bottom',
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.05,
                'text-offset': [0, 1.5],
                'icon-offset': [0, -18]
            },
            'paint': {
                'text-color': '#202',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        });

        SocketFulltrack.init((data) => {
            if (map.style) {
                atualizarMarkerMapa(data, map, aux);
            }
        })

        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('click', 'markersSymbol', function (e) {
            map.getCanvas().style.cursor = 'pointer';

            var coordinates = e.features[0].geometry.coordinates.slice();

            var dadosPopup = {
                'velocidade': e.features[0].properties.velocidade,
                'dt_gps': e.features[0].properties.dt_gps,
                'desc_ativo': e.features[0].properties.desc_ativo,
                'ignicao': e.features[0].properties.ignicao
            }

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup.setLngLat(coordinates).setHTML(templatePopup(dadosPopup)).addTo(map);
        });

        map.on('mouseleave', 'markersSymbol', function () {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }

    function templatePopup(obj) {
        let color = parseInt(obj.ignicao) ? (parseInt(obj.velocidade) > 0 ? '#3972EE' : '#0A6249') : '#F5F5F5';
        let backgroud = parseInt(obj.ignicao) ? (parseInt(obj.velocidade) > 0 ? '#E6EEFF' : '#90ee9080') : '#8E969B';

        return `<div id="popup">
              <div class="info_popup popup_ignicao" style="color:${color}; background:${backgroud}">
                ${parseInt(obj.ignicao) ? "ON" : "OFF"}
              </div>
              <div class="info_popup popup_velocidade">
                ${obj.velocidade} km/h
              </div>
              <div class="info_popup popup_desc">
                ${obj.desc_ativo}
              </div>
            </div>`
    }

    function onStyleData(map, Ct) {
        if (Ct && Ct.style.stylesheet && Ct.style.stylesheet.owner === "mapbox-map-design" && !map.getSource('mapbox-dem')) {
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
            // add the DEM source as a terrain layer with exaggerated height
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        }
    }

    return (
        <>
            <MapBox onStyleData={onStyleData} onStyleLoad={onLoadMap} {...mapOptions} />
        </>
    );
}

export default Dashboard;
