import React, { useEffect, useRef, useState } from 'react'

import MapBox from '../../Componentes/MapBox/mapbox';

import Carrosel from '../../Componentes/Carrosel/carrosel';

import { consolidado, formatLineInMap, calcColorSpeed } from "../../helpers/mapHelper"
import mapboxgl from 'mapbox-gl';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import * as turf from "@turf/turf"
import api from '../../services/api';

import SocketFulltrack from '../../services/socket'

function MapaGeral(props) {

  const [dados, setDados] = useState([]);

  const [operacaoConfig, setOperacaoConfig] = useState({
    cerca:null,
    velocidade:null
  })

  const [operacao, setOperacao] = useState({});
  
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

  const [map, setMap] = useState(null);
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

  var markersOciosos = useRef([]);
  var ultimaPosicaoVeiculo = {};

  var sourceLine = {};
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

  useEffect(() => {

    if (!map) return

    if (map.getSource('rota')) {
      map.removeLayer('rota');
      map.removeSource('rota');
    }

    consolidado.resetConsolidado();

    if (dados.length) {
      let conso = consolidado.consolidarTodosDados(dados, operacaoConfig.cerca);

      if (conso) {
        setDadosConsolidado(conso);

        if (markersOciosos.current.length > 0) {
          for (var i in markersOciosos.current) {
            markersOciosos.current[i].remove();
          }

          markersOciosos.current = [];
        }

        if (conso.posicoesOciosas.length) {
          for (var j in conso.posicoesOciosas) {
            markersOciosos.current.push(
              new mapboxgl.Marker({ color: 'orange' })
                .setLngLat(conso.posicoesOciosas[j])
                .addTo(map)
            )
          }
        }
      }

      let geojson = formatLineInMap.resume(dados, operacaoConfig.velocidade);

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
    }
  }, [dados, map, operacaoConfig])

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

  function buscarDados(form, map) {

    if (map && map.getSource('rota')) {
      map.removeSource('rota')
    }

    api.post('http://api-fulltrack4.ftdata.com.br/relatorio/Rota/gerar/', form, (data) => {
      let posicoesTratadas = data.map((row) => {
        return [row.lst_localizacao[1], row.lst_localizacao[0]]
      })

      for (var i in data) {
        // INVERTENDO AS POSCISAO DAS COORDENADAS
        data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
      }

      setDados(data);
      zoomRota(posicoesTratadas, map)
    })
  }

  async function onLoadMap(map) {

    setMap(map);

    map.on('click', 'rota', (e) => onClickRota(e, map))
    // map.on('mousemove', 'rota', (e) => onMouseOverFeature(e, map));

    let { id } = props.match.params;

    map.addControl(new ZoomControl(), 'top-left');

    if (id) {

      let operacaoAtual = props.location.state;

      setOperacao(operacaoAtual);


      addTalhaoOrdemServico(operacaoAtual, map);

      buscarDados({
        dt_inicial: operacaoAtual.data_init,
        dt_final: operacaoAtual.data_fim,
        id_ativo: id,
        id_motorista: 0,
        timezone: 'America/Sao_Paulo',
        idioma: 'pt-BR',
        id_indice: 5554,
      }, map)


      if (operacaoAtual.status === 'andamento') {

        imagesMarkers.forEach(item => {
          map.loadImage(item.url, function (error, image) {
            map.addImage(item.nome, image)
          })
        });

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

        SocketFulltrack.init((data) => {
          if (data.ras_vei_id === id) {
            atualizarMarkerMapa(data, map, aux);
          }
        })

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

      }

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
  }


  function zoomRota(posicoes, map) {
    var bounds = posicoes.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(posicoes[0], posicoes[0]));

    map.fitBounds(bounds, {
      padding: 20
    });
  }

  function addTalhaoOrdemServico(orderServico, map) {
    var coordenadasTalhao = JSON.parse(orderServico.tal_coordenada);

    setOperacaoConfig({
      cerca:turf.polygon(coordenadasTalhao),
      velocidade:parseInt(orderServico.osr_velocidade)
    })

    let feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': coordenadasTalhao
      },
      'properties': {
        'talhao': orderServico.tal_descricao,
        'cultura': orderServico.cul_descricao
      }
    }

    if (map.getSource('talhao')) {
      map.getSource('talhao').setData(feature)
    } else {
      map.addSource('talhao', {
        'type': 'geojson',
        'data': feature
      })
    }

    !map.getLayer('talhao_fill') && map.addLayer({
      'id': 'talhao_fill',
      'type': 'fill',
      'source': 'talhao',
      'layout': {},
      'paint': {
        'fill-color': 'white',
        'fill-opacity': 0.1,
        'fill-outline-color': 'black'
      }
    });

    !map.getLayer('talhao_line') && map.addLayer({
      'id': 'talhao_line',
      'type': 'line',
      'source': 'talhao',
      'layout': {},
      'paint': {
        'line-color': 'black',
        'line-width': 4
      }
    });

    // DAR ZOOM NO TALHAO DA ORDEM DE SERVICO
    var bounds = coordenadasTalhao[0].reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordenadasTalhao[0][0], coordenadasTalhao[0][0]));

    map.fitBounds(bounds, {
      padding: 20,
      offset: [5, 5]
    });
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

  // function onClickConsolidado(stringConsolidado, dados) {
  //   if (map.getLayer('rota')) {
  //     map.removeLayer('rota');
  //   }

  //   switch (stringConsolidado) {
  //     case 'tempoTrabalho':
  //       break;
  //     case 'tempDeslocamneto':
  //       break;
  //     case 'tempoDentroCerca':
  //       break;
  //     case 'tempoEfetivo':
  //       break;
  //     case 'tempoOcioso':

  //       if (map.getSource('markersOciosos')) {
  //         return
  //       }

  //       let markersOciosos = {
  //         'type': 'FeatureCollection',
  //         'features': []
  //       }

  //       let { posicoesOciosas } = dados;

  //       for (var i in posicoesOciosas) {
  //         markersOciosos.features.push(turf.point(posicoesOciosas[i], { title: 'Ociosos', 'marker-symbol': 'airfield' }))
  //       }

  //       map.addSource('markersOciosos', {
  //         type: 'geojson',
  //         data: markersOciosos
  //       })

  //       let img = new Image(20, 20)
  //       img.onload = () => map.addImage('ocioso', img)
  //       img.src = MarkerSvg

  //       map.addLayer({
  //         'id': 'markersOciosos',
  //         'type': 'symbol',
  //         'source': 'markersOciosos',
  //         'layout': {
  //           'icon-size': 1,
  //           'icon-image': 'ocioso',
  //           'icon-allow-overlap': true,
  //           // get the title name from the source's "title" property
  //           'text-field': ['get', 'title'],
  //           'text-font': [
  //             'Open Sans Semibold',
  //             'Arial Unicode MS Bold'
  //           ],
  //           // 'text-offset': [0, 1.25],
  //           'text-anchor': 'top',
  //           'text-transform': 'uppercase',
  //           'text-letter-spacing': 0.05,
  //           'text-offset': [0, 1.5]
  //         },
  //         'paint': {
  //           'icon-color': 'red',
  //           'text-color': '#202',
  //           'text-halo-color': '#fff',
  //           'text-halo-width': 2
  //         }
  //       });


  //       break;
  //     case 'tempoDesligado':
  //       break;
  //     default:
  //       break
  //   }
  // }


  return (
    <>
      <MapBox onStyleLoad={onLoadMap} {...mapOptions} />
      <Carrosel operacao={operacao} consolidado={dadosConsolidado} />
    </>
  );
}

export default MapaGeral;
