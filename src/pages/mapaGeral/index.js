import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf"
import api from '../../services/api';

import { consolidado, formatLineInMap } from "../../helpers/mapHelper"

import MapBox from './mapbox';
import Tabela from './tabela';
import Filtro from './filtro';
import PainelConsolidado from './painelConsolidado';

import 'mapbox-gl-controls/theme.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './mapbox.css'


function MapaGeral(props) {

  const [posicoes, setPosicoes] = useState([]);

  const [markerTabela, setMarkerTabela] = useState([]);
  const [center, setCenter] = useState([-22.21537, -49.653947]);
  const [dados, setDados] = useState([]);
  const [geojson, setGeoJson] = useState([]);
  const [cercaConsolidado, setCercaConsolidado] = useState(null);

  const [dadosConsolidado, setDadosConsolidado] = useState({
    tempoTrabalho: "00:00:00",
    deslocamento: "00:00:00",
    tempoDentroCerca: "00:00:00",
    tempoDentroCercaDesligado: "00:00:00",
    tempoDentroCercaOcioso: "00:00:00",
    tempoDentroCercaTrabalhando: "00:00:00",
    porcDentroCerca: 0,
    porcForaCerca: 0,
    porcDentroCercaOcioso: 0,
    porcDentroCercaDesligado: 0,
    porcDentroCercaTrabalhando: 0
  });

  var popups = [];
  var draw = null;

  const mapContainer = useRef(null);

  const [mapOptions, setMapOptions] = useState({
    center: [-49.654063, -22.215288],
    style: "mapbox://styles/mapbox/satellite-v9",
    containerStyle: {
      height: '100vh',
      width: '100vw'
    }
    // pitch: [85],
    // bearing: [80],
    // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
    // style: "mapbox://styles/mapbox/satellite-v9",
  })

  useEffect(() => {

  }, [])

  useEffect(() => {
    let map = mapContainer.current.state.map;
    if (!map) return

    if (map.getSource('rota')) {
      map.removeLayer('rota');
      map.removeSource('rota');
    }
    consolidado.resetConsolidado();

    if (true) {
      let conso = consolidado.consolidarTodosDados(dados, cercaConsolidado);
      if (conso) {
        setDadosConsolidado(conso);
      }
      let geojson = formatLineInMap.resume(dados);
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
          'line-width': 3,
        }
      });

    } else {
      formatLineInMap.animacao(dados, map, function (eventoAtual) {
        let conso = consolidado.consolidarRealTime({ cercaConsolidado, eventoAtual });
        console.log(conso);

        if (conso) {
          setDadosConsolidado(conso);
        }

      });

    }




    // // SETINHA NAS LINHAS

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

  // function consolidarDados(index) {
  //   posAtual = turf.point(dados[indexInterval].lst_localizacao);
  //   if (turf.inside(posAtual, cercaConsolidado)) {

  //   }
  // }

  function buscarDados(form) {
    api.post('/relatorio/Rota/gerar/', form).then((response) => {
      return response.data;
    }).then((data) => {
      let posicoesTratadas = data.map((row) => {
        return [row.lst_localizacao[1], row.lst_localizacao[0]]
      })

      for (var i in data) {
        data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
      }
      setDados(data);
      setPosicoes(posicoesTratadas);
    })
  }

  function addCamadasMapbox(map) {
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
  }

  async function getlayerFazenda(map) {
    let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/anuncio/Ce3jaao765n5Rry37CeeCsf99o99euufyyar951ssa57j749-pt-br.json");
    let geojson = await retorno.json();


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

  async function onLoadMap(map) {

    map.on('click', 'rota', (e) => onClickRota(e, map))
    map.on('mousemove', (e) => onMouseOverFeature(e, map));

    // ADD CAMADA DOM MAPA
    addCamadasMapbox(map);
    addMapBoxDraw(map);
    // getlayerFazenda(map)

  }
  function updateArea(e) {
    var data = draw.getAll();
    if (data.features.length > 0) {
      setCercaConsolidado(turf.polygon(data.features[0].geometry.coordinates));
      var area = turf.area(data);

      // restrict to area to 2 decimal points
      var rounded_area = Math.round(area * 100) / 100;
      console.log(rounded_area + " metros quadrados");
    }
  }

  function addMapBoxDraw(map) {
    draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    })

    map.addControl(draw, 'top-left');


    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
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

  function onclickButtonGerar(data) {
    if (data.dt_inicial && data.dt_final) {
      buscarDados({
        dt_final: data.dt_final.toLocaleString("pt-BR"),
        dt_inicial: data.dt_inicial.toLocaleString("pt-BR"),
        id_ativo: 241354,
        id_motorista: 0,
        timezone: 'America/Sao_Paulo',
        idioma: 'pt-BR',
        id_indice: 5554,
      })
    }
  }

  function onStyleData(map, Ct) {
    if (Ct && Ct.style.stylesheet && Ct.style.stylesheet.owner == "mapbox-map-design" && !map.getSource('mapbox-dem')) {
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
      <PainelConsolidado dados={dadosConsolidado} />
      <Filtro onclickButtonGerar={onclickButtonGerar} />
      {/* <Carrosel /> */}
    </>
  );
}

export default MapaGeral;
