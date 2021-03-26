import React, { useEffect, useRef, useState } from 'react'

import MapBox from '../../Componentes/MapBox/mapbox';
import Filtro from '../../Componentes/FiltroMapa/filtro';
import Carrosel from '../../Componentes/Carrosel/carrosel';
import InfoConsolidadoMapa from '../../Componentes/InfoConsolidadoMapa/InfoConsolidadoMapa';

import 'mapbox-gl-controls/theme.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../../Componentes/MapBox/mapbox.css'

import { consolidado, formatLineInMap } from "../../helpers/mapHelper"
import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf"
import api from '../../services/api';

import MarkerSvg from 'maki/icons/marker-15.svg'

function MapaGeral(props) {

  const [posicoes, setPosicoes] = useState([]);

  const [dados, setDados] = useState([]);
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
    porcDentroCercaTrabalhando: 0,
    porcTerrenoFeito: ""
  });

  var popups = [];
  var draw = null;

  const mapContainer = useRef(null);

  const mapOptions = {
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
  }

  useEffect(() => {
    let { id } = props.match.params;

    if (id) {

      let dados = props.location.state;

      buscarDados({
        dt_inicial: dados.data_f + " 00:00:00",
        dt_final: dados.data_f + " 23:59:59",
        id_ativo: id,
        id_motorista: 0,
        timezone: 'America/Sao_Paulo',
        idioma: 'pt-BR',
        id_indice: 5554,
      })
    }
  }, [props.location.state, props.match.params])

  useEffect(() => {
    let { map } = mapContainer.current.state;

    if (!map) return

    if (map.getSource('rota')) {
      map.removeLayer('rota');
      map.removeSource('rota');
    }
    consolidado.resetConsolidado();

    if (false) {

      let conso = consolidado.consolidarTodosDados(dados, cercaConsolidado);

      if (conso) {
        setDadosConsolidado(conso);
      }

      let geojson = formatLineInMap.resume(dados);
      let cercaRotaAtual = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [posicoes]
            }
          },
        ]
      }
      console.log(Math.round(turf.area(cercaRotaAtual) * 100) / 100 + " Area percorrida");
      if (cercaConsolidado) {
        console.log(Math.round(turf.area(cercaConsolidado) * 100) / 100 + " Area Total");
      }


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


      // CASO FOR MONTAR A LINHA COMO POLYGON (VER O TANTO QUE FOI FEITO NO TALHAO)

      // map.addSource('rota', {
      //   'type': 'geojson',
      //   'data': data,
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


    } else {
      formatLineInMap.animacao(dados, map, function (eventoAtual) {
        let conso = consolidado.consolidarRealTime({ cercaConsolidado, eventoAtual });

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



  }, [posicoes, cercaConsolidado, dados])

  function buscarDados(form) {
    let { map } = mapContainer.current;

    if (map && map.getSource('rota')) {
      map.removeSource('rota')
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
      setDados(data);
      setPosicoes(posicoesTratadas);
    })
  }

  function addCamadasMapboxControl(map) {
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
    addCamadasMapboxControl(map);
    addMapBoxDraw(map);
    getlayerFazenda(map);

  }
  function updateArea(e) {
    var data = draw.getAll();
    if (data.features.length > 0) {
      setCercaConsolidado(turf.polygon(data.features[0].geometry.coordinates));
      // var area = turf.area(data);

      // // restrict to area to 2 decimal points
      // var rounded_area = Math.round(area * 100) / 100;
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
      .setHTML(templatePopup(e.features[0].properties))
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

  function onClickConsolidado(stringConsolidado, dados) {
    let { map } = mapContainer.current.state;
    if (map.getLayer('rota')) {
      map.removeLayer('rota');
    }

    switch (stringConsolidado) {
      case 'tempoTrabalho':
        break;
      case 'tempDeslocamneto':
        break;
      case 'tempoDentroCerca':
        break;
      case 'tempoEfetivo':
        break;
      case 'tempoOcioso':

        if (map.getSource('markersOciosos')) {
          return
        }

        let markersOciosos = {
          'type': 'FeatureCollection',
          'features': []
        }

        let { posicoesOciosas } = dados;

        for (var i in posicoesOciosas) {
          markersOciosos.features.push(turf.point(posicoesOciosas[i], { title: 'Ociosos', 'marker-symbol': 'airfield' }))
        }

        map.addSource('markersOciosos', {
          type: 'geojson',
          data: markersOciosos
        })

        let img = new Image(20, 20)
        img.onload = () => map.addImage('ocioso', img)
        img.src = MarkerSvg

        map.addLayer({
          'id': 'markersOciosos',
          'type': 'symbol',
          'source': 'markersOciosos',
          'layout': {
            'icon-size': 1,
            'icon-image': 'ocioso',
            'icon-allow-overlap': true,
            // get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': [
              'Open Sans Semibold',
              'Arial Unicode MS Bold'
            ],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'top',
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.05,
            'text-offset': [0, 1.5]
          },
          'paint': {
            'icon-color': 'red',
            'text-color': '#202',
            'text-halo-color': '#fff',
            'text-halo-width': 2
          }
        });


        break;
      case 'tempoDesligado':
        break;
      default:
        break
    }
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
      <MapBox ref={mapContainer} posicoes={posicoes} onStyleData={onStyleData} onStyleLoad={onLoadMap} {...mapOptions} />
      <InfoConsolidadoMapa dados={dadosConsolidado} onClickConsolidado={onClickConsolidado} />
      <Filtro onclickButtonGerar={onclickButtonGerar} />
      <Carrosel />
    </>
  );
}

export default MapaGeral;
