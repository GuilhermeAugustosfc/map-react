import React, { useEffect, useRef, useState } from 'react'
import api from '../../services/api';
import Mapa from './mapa';
import Mapa2 from './mapa2';


import MapBox from './mapbox';

import Tabela from './tabela';
import Carrosel from "./carrosel";


function MapaGeral() {

  const [posicoes, setPosicoes] = useState([]);

  const [markerTabela, setMarkerTabela] = useState([]);
  const [center, setCenter] = useState([-22.21537, -49.653947]);
  const [dados, setDados] = useState([]);
  const [geojson, setGeoJson] = useState([]);

  const [colorsSpeed, setColorSpeed] = useState([
    { color: '#0000FF' }, { color: '#0040FF' }, { color: '#0080FF' },
    { color: '#00FFB0' }, { color: '#00E000' }, { color: '#80FF00' },
    { color: '#FFFF00' }, { color: '#FFC000' }, { color: '#FF0000' }
  ])

  const mapContainer = useRef(null);

  const [mapOptions, setMapOptions] = useState({
    center: [-49.654063, -22.215288 ],
    style: "mapbox://styles/mapbox/satellite-v9",
    containerStyle: {
      height: '100vh',
      width: '100vw'
    }
  })

  async function onLoadMap(map) {

    let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/kmz/6liaAtRuspsaa32ia771aatsaA3leaRaad24umua3aap26t3-pt-br.json");
    let geojson = await retorno.json();

    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point);

      // Limit the number of properties we're displaying for
      // legibility and performance
      var displayProperties = [
          'id',
          'layer',
          'source',
          'sourceLayer',
          'state',
          'properties',
      ];

      var displayFeatures = features.map(function (feat) {
          var displayFeat = {};
          displayProperties.forEach(function (prop) {
              displayFeat[prop] = feat[prop];
          });
          return displayFeat;
      });

      console.log(displayFeatures);
  });



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


  function onHoverRow(latlon) {
    // setCenter(latlon);
    // setMarkerTabela(latlon);
  }

  useEffect(async () => {
    let form = new FormData();
    form.append('id_cliente', 200078);
    form.append('id_ativo', 156167);
    form.append('id_motorista', 0);
    form.append('timezone', 'America/Sao_Paulo');
    form.append('dt_inicial', '02/02/2021 00:00:00');
    form.append('dt_final', '05/03/2021 23:59:59');
    form.append('idioma', 'pt-BR');
    form.append('id_indice', 7112);
    form.append('id_usuario', 83713);
    form.append('pagination_client', 1);

    api.post('/relatorio/Rota/gerar/', form).then((response) => {
      return response.data;
    }).then((data) => {

      let posicoesTratadas = data.map((row) => {
        return [row.lst_localizacao[1], row.lst_localizacao[0]]
      })

      for(var i in data) {
        data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
      }

      setDados(data)
      setPosicoes(posicoesTratadas)
      console.log('atualizdo');
    })


    let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/kmz/6liaAtRuspsaa32ia771aatsaA3leaRaad24umua3aap26t3-pt-br.json");
    let geojson = await retorno.json();

    setGeoJson(geojson)

  }, [])


  function calcColorSpeed(speed) {
    var i,
      speedThresholds = [10, 20, 30, 45, 50, 55, 60, 65];

    for (i = 0; i < speedThresholds.length; ++i) {
      if (speed <= speedThresholds[i]) {
        return i;
      }
    }
    return speedThresholds.length;
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

      if (prevOptionIdx !== optionIdx || i === len - 1) {
        geojson.features.push({
          'type': 'Feature',
          'properties': {
            'color': colorsSpeed[optionIdx].color
          },
          'geometry': {
            'type': 'LineString',
            'coordinates': segmentLatlngs
          }
        })

        prevOptionIdx = optionIdx;
        segmentLatlngs = [dados[i].lst_localizacao];
      }
    }
    return geojson
  }


  useEffect(() => {

    let map = mapContainer.current.state.map;
    if (!map) return

    let geojson = formatPolilyneColor(dados)

    map.addSource('rota', {
      'type': 'geojson',
      'data': geojson
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
        'line-width': 3,
      }
    });


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






  }, [posicoes])

  useEffect(() => { }, [dados])


  return (
    <>
      {/* <Mapa geojson={geojson} dados={dados} polyline={posicoes} makers={markerTabela} centerMap={center} /> */}
      <MapBox ref={mapContainer} posicoes={posicoes} onStyleLoad={onLoadMap} {...mapOptions} />
      {/* <Mapa2 /> */}
      {/* <Tabela onHoverRow={onHoverRow} dados={dados} /> */}
      {/* <Carrosel /> */}
    </>
  );
}

export default MapaGeral;
