import React, { useEffect, useRef, useState } from 'react'

import MapBox from '../../Componentes/MapBox/mapbox';
import Filtro from '../../Componentes/FiltroMapa/filtro';
import Carrosel from '../../Componentes/Carrosel/carrosel';
import InfoConsolidadoMapa from '../../Componentes/InfoConsolidadoMapa/InfoConsolidadoMapa';


import { consolidado, formatLineInMap, calcColorSpeed } from "../../helpers/mapHelper"
import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf"
import api from '../../services/api';

import MarkerSvg from 'maki/icons/marker-15.svg'
import SocketFulltrack from '../../services/socket'

import 'mapbox-gl-controls/theme.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../../Componentes/MapBox/mapbox.css'

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

  const mapContainer = useRef(null);
  const colorsSpeed = [{ color: '#868b00' }, { color: '#00008b' }, { color: 'darkred' }, { color: 'black' }]

  const [mapOptions, setMapOptions] = useState({
    center: [-49.654063, -22.215288],
    style: "mapbox://styles/mapbox/satellite-v9",
    // style: "mapbox://styles/mapbox/streets-v9",
    containerStyle: {
      height: '100vh',
      width: '100vw'
    }
  })

  var popups = [];
  var draw = null;
  var markersOciosos = [];
  var ultimaPosicaoVeiculo = {};

  var sourceLine = {};
  var sourceMarker = {};
  var sourceMarkerIndex = {};

  var imagesMarkers = {
    desligado: 'https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-pt-br.png',
    movimento: 'https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-es-es.png',
    ligado: 'https://fulltrackstatic.s3.amazonaws.com/anuncio/Dm4aomaD9om6gr4D42kr0Pgn4Dlnml0l73o52p7D499p4png63-en-us.png'
  };

  useEffect(() => {
    let { map } = mapContainer.current.state;

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
        markersOciosos = [];
        if (conso.posicoesOciosas.length) {
          for (var i in conso.posicoesOciosas) {
            markersOciosos.push(
              new mapboxgl.Marker({ color: 'orange' })
                .setLngLat(conso.posicoesOciosas[i])
                .addTo(map)
            )
          }
        }
      }

      let geojson = formatLineInMap.resume(dados, map);

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

    } else {
      formatLineInMap.animacao(dados, map, function (eventoAtual) {
        let conso = consolidado.consolidarRealTime({ cercaConsolidado, eventoAtual });

        if (conso) {

          setDadosConsolidado(conso);

          markersOciosos = [];
          if (conso.posicoesOciosas.length) {
            markersOciosos.push(
              new mapboxgl.Marker({ color: 'orange' })
                .setLngLat(conso.posicoesOciosas)
                .addTo(map)
            )
          }
        }

      });

    }

  }, [dados])

  useEffect(() => {
    let { map } = mapContainer.current.state;

    if (!map) return

    var bounds = posicoes.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(posicoes[0], posicoes[0]));

    map.fitBounds(bounds, {
      padding: 20
    });

  }, [posicoes])

  function atualizarMarkerMapa(data, map, aux) {

    aux.coordenadas = [parseFloat(data.ras_eve_longitude), parseFloat(data.ras_eve_latitude)];

    if (sourceLine.hasOwnProperty(data.ras_vei_id)) {

      ultimaPosicaoVeiculo[data.ras_vei_id].push(aux.coordenadas);
      aux.rotaAtual = map.getSource(`source_${data.ras_vei_id}`)._data;

      aux.rotaAtual.features.push({
        'type': 'Feature',
        'properties': {
          'color': colorsSpeed[aux.indexCor].color,
          'velocidade': data.ras_eve_velocidade,
          'dt_gps': data.ras_eve_data_gps,
          'desc_ativo': data.ras_vei_veiculo,
          'ignicao': data.ras_eve_ignicao
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': ultimaPosicaoVeiculo[data.ras_vei_id]
        }
      })

      map.getSource(`source_${data.ras_vei_id}`).setData(aux.rotaAtual)

      ultimaPosicaoVeiculo[data.ras_vei_id] = [];
      ultimaPosicaoVeiculo[data.ras_vei_id] = [aux.coordenadas]

    } else {

      sourceLine[data.ras_vei_id] = [];
      sourceLine[data.ras_vei_id] = {
        features: [],
        type: "FeatureCollection"
      }

      map.addSource(`source_${data.ras_vei_id}`, {
        'type': 'geojson',
        'data': sourceLine[data.ras_vei_id],
      });


      map.addLayer({
        'id': `source_${data.ras_vei_id}`,
        'type': 'line',
        'source': `source_${data.ras_vei_id}`,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round',
        },
        'paint': {
          'line-color': ['get', 'color'],
          'line-width': 3,
        }
      });

      // map.jumpTo({ 'center': aux.coordenadas, 'zoom': 15 });

      aux.indexCor = calcColorSpeed(data.ras_eve_velocidade);

      if (!ultimaPosicaoVeiculo.hasOwnProperty(data.ras_vei_id)) {
        ultimaPosicaoVeiculo[data.ras_vei_id] = [];
        ultimaPosicaoVeiculo[data.ras_vei_id].push(aux.coordenadas)
      }

      ultimaPosicaoVeiculo[data.ras_vei_id].push(aux.coordenadas);

      aux.rotaAtual = map.getSource(`source_${data.ras_vei_id}`)._data;
      aux.rotaAtual.features.push({
        'type': 'Feature',
        'properties': {
          'color': colorsSpeed[aux.indexCor].color,
          'velocidade': data.ras_eve_velocidade,
          'dt_gps': data.ras_eve_data_gps,
          'desc_ativo': data.ras_vei_veiculo,
          'ignicao': data.ras_eve_ignicao,
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': ultimaPosicaoVeiculo[data.ras_vei_id]
        }
      })


      map.getSource(`source_${data.ras_vei_id}`).setData(aux.rotaAtual)


      ultimaPosicaoVeiculo[data.ras_vei_id] = [];
      ultimaPosicaoVeiculo[data.ras_vei_id] = [aux.coordenadas]
    }

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

    // map.panTo([parseFloat(data.ras_eve_longitude), parseFloat(data.ras_eve_latitude)]);

  }

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
        // INVERTENDO AS POSCISAO DAS COORDENADAS
        data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
      }
      setDados(data);
      setPosicoes(posicoesTratadas);
    })
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

    map.on('click', 'rota', (e) => onClickRota(e, map))
    // map.on('mousemove', 'rota', (e) => onMouseOverFeature(e, map));

    // ADD CAMADA DOM MAPA
    addMapBoxControll(map);
    // getlayerFazenda(map);


    loadImages(map, imagesMarkers, (images) => {
      map.addImage('marker-desligado', images['desligado']);
      map.addImage('marker-ligado', images['ligado']);
      map.addImage('marker-movimento', images['movimento']);

      var aux = {
        rotaAtual: [],
        indexCor: null,
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

      // SocketFulltrack.init((data) => {
      //   console.log(data);
      //   atualizarMarkerMapa(data, map, aux);
      // })

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

  function loadImages(map, urls, callback) {
    var results = {};
    for (var name in urls) {
      map.loadImage(urls[name], makeCallback(name));
    }

    function makeCallback(name) {
      return function (err, image) {
        results[name] = err ? null : image;

        // if all images are loaded, call the callback
        if (Object.keys(results).length === Object.keys(urls).length) {
          callback(results);
        }
      };
    }
  }

  function updateArea(e) {
    var data = draw.getAll();
    if (data.features.length > 0) {
      console.log(JSON.stringify(data.features[0].geometry.coordinates));
      setCercaConsolidado(turf.polygon(data.features[0].geometry.coordinates));
      // draw.remove();
      var area = turf.area(data);

      // restrict to area to 2 decimal points
      var rounded_area = Math.round(area * 100) / 100;
      console.log(rounded_area + ' area autil');
    }
  }

  function addMapBoxControll(map) {
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
    }), 'top-left');

    draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
    })

    map.addControl(draw, 'top-left');
    map.addControl(new ZoomControl(), 'top-left');


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
