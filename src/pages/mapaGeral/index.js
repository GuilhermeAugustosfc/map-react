import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import 'mapbox-gl-controls/theme.css'
import api from '../../services/api';
import Mapa from './mapa';
import Mapa2 from './mapa2';
import MapBox from './mapbox';
import Tabela from './tabela';
import Carrosel from "./carrosel";

import './mapbox.css'


function MapaGeral(props) {

  const [posicoes, setPosicoes] = useState([]);

  const [markerTabela, setMarkerTabela] = useState([]);
  const [center, setCenter] = useState([-22.21537, -49.653947]);
  const [dados, setDados] = useState([]);
  const [geojson, setGeoJson] = useState([]);


  var popups = [];

  const [colorsSpeed, setColorSpeed] = useState([
    { color: '#0000FF' }, { color: '#0040FF' }, { color: '#0080FF' },
    { color: '#00FFB0' }, { color: '#00E000' }, { color: '#80FF00' },
    { color: '#FFFF00' }, { color: '#FFC000' }, { color: '#FF0000' }
  ])

  // onStyleData.bind(this)

  const mapContainer = useRef(null);

  const [mapOptions, setMapOptions] = useState({
    center: [-49.654063, -22.215288],
    style: "mapbox://styles/mapbox/streets-v9",
    containerStyle: {
      height: '100vh',
      width: '100vw'
    }
    // pitch: [85],
    // bearing: [80],
    // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
    // style: "mapbox://styles/mapbox/satellite-v9",
  })

  useEffect(async () => {
    let form = {
      id_cliente: 200078,
      id_ativo: 156167,
      id_motorista: 0,
      timezone: 'America/Sao_Paulo',
      dt_inicial: '02/02/2021 00:00:00',
      dt_final: '05/03/2021 23:59:59',
      idioma: 'pt-BR',
      id_indice: 7112,
      id_usuario: 83713,
      pagination_client: 1,
    }

    api.post('/relatorio/Rota/gerar/', form).then((response) => {
      return response.data;
    }).then((data) => {
      let posicoesTratadas = data.map((row) => {
        return [row.lst_localizacao[1], row.lst_localizacao[0]]
      })

      for (var i in data) {
        data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
      }

      setDados(data)
      setPosicoes(posicoesTratadas)

    })
  }, [])

  useEffect(() => {
    let map = mapContainer.current.state.map;
    if (!map) return

    let geojson = formatPolilyneColor(dados)

    map.addSource('rota', {
      'type': 'geojson',
      'data': geojson,
    });

    map.addLayer({
      'id': 'rota',
      'type': 'line',
      'source': 'rota',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': ['get', 'color'],
        'line-width': 5,
      }
    });


  }, [posicoes])

  async function onLoadMap(map) {

    map.on('click', 'rota', (e) => onClickRota(e, map))
    map.on('mousemove', (e) => onMouseOverFeature(e, map));

    let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/anuncio/Ce3jaao765n5Rry37CeeCsf99o99euufyyar951ssa57j749-pt-br.json");
    let geojson = await retorno.json();


    // ADD CAMADA DOM MAPA
    map.addControl(new StylesControl({
      styles: [
        {
          label: 'Streets',
          styleName: 'Mapbox Streets',
          styleUrl: 'mapbox://styles/mapbox/streets-v9',
        },
        {
          label: 'Satellite',
          styleName: 'Satellite',
          styleUrl: 'mapbox://styles/mapbox/satellite-v9',

        },
        {
          label: 'Terreno',
          styleName: 'Terreno',
          styleUrl: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        },
      ],
      onChange: (style) => {
      },
    }), 'top-left');



    // map.addSource('mapbox-dem', {
    //   'type': 'raster-dem',
    //   'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    //   'tileSize': 512,
    //   'maxzoom': 14
    // });
    // // add the DEM source as a terrain layer with exaggerated height
    // map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });


    // ADD LAYERS DA FAZENDA (MAPA)
    map.addSource('fazenda', {
      'type': 'geojson',
      'data': geojson,
    });

    map.addLayer({
      'id': 'fazenda',
      'type': 'line',
      'source': 'fazenda',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 1,
      }
    });

  }

  function onMouseOverFeature(e, map) {
    var features = map.queryRenderedFeatures(e.point);
    var displayProperties = [
      'id',
      'layer',
      'source',
      'sourceLayer',
      'state',
      'properties',
      'geometry'
    ];


    var displayFeatures = features.map(function (feat) {
      let displayFeat = {};

      displayProperties.forEach(function (prop) {
        displayFeat[prop] = feat[prop];
      });
      return displayFeat;


    });

    if (displayFeatures.length && ['rota'].includes(displayFeatures[0].source)) {
      if (popups.length > 0) {
        for (var i in popups) {
          popups[i].remove();
        }
        popups = [];
      }

      let popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(templatePopup(displayFeatures[0].properties))
        .addTo(map);

      popups.push(popup)
    }
  }

  function onHoverRow(latlon) {
    // setCenter(latlon);
    // setMarkerTabela(latlon);
  }

  function calcColorSpeed(speed) {
    var i,
      speedThresholds = [10, 20, 30, 45, 50, 55, 60, 65];

    for (i = 0; i < speedThresholds.length; ++i) {
      if (speed <= speedThresholds[i]) {
        return { index: i, velocidade: speed };
      }
    }
    return { index: speedThresholds.length, velocidade: speed };
  }

  function formatPolilyneColor(dados) {

    var i, len = dados.length,
      prevOptionIdx, optionIdx,
      segmentLatlngs;

    let geojson = {
      'type': 'FeatureCollection',
      'features': []
    };

    for (i = 1; i < len; ++i) {
      optionIdx = calcColorSpeed(dados[i].vl_velocidade);

      if (i === 1) {
        segmentLatlngs = [dados[0].lst_localizacao];
        prevOptionIdx = calcColorSpeed(dados[0].vl_velocidade);
      }

      segmentLatlngs.push(dados[i].lst_localizacao);

      if (prevOptionIdx.index !== optionIdx.index || i === len - 1) {
        geojson.features.push({
          'type': 'Feature',
          'properties': {
            'color': colorsSpeed[optionIdx.index].color,
            'velocidade': optionIdx.velocidade,
            'dt_gps': dados[i].dt_gps,
            'desc_ativo': dados[i].desc_ativo
          },
          'geometry': {
            'type': 'LineString',
            'coordinates': segmentLatlngs
          }
        })

        prevOptionIdx.index = optionIdx.index;
        segmentLatlngs = [dados[i].lst_localizacao];
      }
    }
    return geojson
  }

  function onClickRota(e, map) {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(templatePopup(e.features[0].properties.velocidade, e.features[0].properties.color))
      .addTo(map);
  }

  function templatePopup(obj) {
    return `<div id="popup" style="border-bottom:1px solid ${obj.color}">
              <strong>Data:</strong> ${obj.dt_gps}
              </br>
              <strong>Velocidade:</strong> ${obj.velocidade}
              </br>
              <strong>Descrição:</strong> ${obj.desc_ativo}
            </div>`
  }

  function onStyleData(map, Ct) {
    if (Ct && Ct.style.stylesheet && Ct.style.stylesheet.owner == "mapbox-map-design" && !map.getSource('mapbox-dem')) {
      console.log('terrar');
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
      {/* <Mapa geojson={geojson} dados={dados} polyline={posicoes} makers={markerTabela} centerMap={center} /> */}
      <MapBox ref={mapContainer} posicoes={posicoes} onStyleData={onStyleData} onStyleLoad={onLoadMap} {...mapOptions} />
      {/* <Mapa2 /> */}
      {/* <Tabela onHoverRow={onHoverRow} dados={dados} /> */}
      {/* <Carrosel /> */}
    </>
  );
}

export default MapaGeral;
