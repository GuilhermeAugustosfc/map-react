import React, { useEffect, useRef, useState } from 'react'

import MapBox from '../../Componentes/MapBox/mapbox';

import Carrosel from '../../Componentes/Carrosel/carrosel';

import { consolidado, formatLineInMap, calcColorSpeed } from "../../helpers/mapHelper"
import mapboxgl from 'mapbox-gl';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import * as turf from "@turf/turf"
import api from '../../services/api';

import Filtro from '../../Componentes/FiltroMapa/FiltroMapa'

import { store } from 'react-notifications-component';

import SocketFulltrack from '../../services/socket'

function MapaGeral(props) {

  const [dados, setDados] = useState([]);

  const [operacaoConfig, setOperacaoConfig] = useState({
    cerca: null,
    velocidade: null
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
  });

  const [map, setMap] = useState(null);
  const colorsSpeed = [{ color: 'yellow' }, { color: 'green' }, { color: 'darkred' }];
  const [mapOptions, setMapOptions] = useState({
    center: [-49.654063, -22.215288],
    // style: "mapbox://styles/mapbox/dark-v9",
    style: "mapbox://styles/mapbox/satellite-v9",
    containerStyle: {
      height: '100vh',
      width: '100vw'
    }
  })

  var markersOciosos = useRef([]);
  var ultimaPosicaoVeiculo = useRef({});

  var sourceLine = {};
  var sourceMarker = {};
  var sourceMarkerIndex = {};

  var imagesMarkersVeiculo = [
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

  var imagesMarkersMacro = [
    {
      url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/81gn1143p383124211p488128831113n231n333n1831n3n-pt-br.png",
      nome: "macro-pausar"
    },
    {
      url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/pg1826232323n3831232382232322g22218n311p22333-pt-br.png",
      nome: "macro-iniciar"
    },
    {
      url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/82838313881n33g22ggp1382622pn32n36n1323226g622-pt-br.png",
      nome: "macro-deslocamento"
    },
    {
      url: "https://fulltrackstatic.s3.amazonaws.com/anuncio/12g223p311n3433g281814g28813n1211323228n38g3n1p22-pt-br.png",
      nome: "macro-finalizar"
    }
  ]

  useEffect(() => {
    return () => SocketFulltrack.disconectSocket();
  }, [])


  useEffect(() => {

    if (!map) return

    consolidado.resetConsolidado();

    if (dados.length) {
      let conso = consolidado.consolidarTodosDados(dados, operacaoConfig.cerca);

      if (conso) {
        setDadosConsolidado(conso);

        // if (markersOciosos.current.length > 0) {
        //   for (var i in markersOciosos.current) {
        //     markersOciosos.current[i].remove();
        //   }

        //   markersOciosos.current = [];
        // }

        // if (conso.posicoesOciosas.length) {
        //   for (var j in conso.posicoesOciosas) {
        //     markersOciosos.current.push(
        //       new mapboxgl.Marker({ color: 'orange' })
        //         .setLngLat(conso.posicoesOciosas[j])
        //         .addTo(map)
        //     )
        //   }
        // }

      }


      let ultimaPosicaoRota = dados[dados.length - 1];
      ultimaPosicaoVeiculo.current[ultimaPosicaoRota.id_ativo] = [ultimaPosicaoRota.lst_localizacao];

      let geojson = formatLineInMap.lineOfSpeed(dados, operacaoConfig.velocidade);
      addRotaVeiculo(map, geojson)
    }

  }, [dados, map, operacaoConfig])

  function addRotaVeiculo(map, geojson) {

    if (map.getSource('rota')) {
      map.getSource('rota').setData(geojson);
    } else {
      map.addSource('rota', {
        'type': 'geojson',
        'data': geojson,
      });
    }

    if (map.getLayer('rota')) {
      map.removeLayer('rota');
    }

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
        'line-width': ['get', 'line-width'],
      }
    });
    console.log(`add rota`);

  }

  function atualizarMarkerMapa(dadosVeiculo, map, aux) {

    var coordenadas = [parseFloat(dadosVeiculo.ras_eve_longitude), parseFloat(dadosVeiculo.ras_eve_latitude)];
    var rotaAtual = {};
    var indexCor = null;
    // IMENDANDO AS POSICOES DO SOCKET COM A ROTA DELE ----

    if (ultimaPosicaoVeiculo.current.hasOwnProperty(dadosVeiculo.ras_vei_id)) {
      rotaAtual = map.getSource(`rota`)._data;
      ultimaPosicaoVeiculo.current[dadosVeiculo.ras_vei_id].push(coordenadas);
      indexCor = calcColorSpeed(dadosVeiculo.ras_eve_velocidade, operacaoConfig.velocidade);

      rotaAtual.features.push({
        'type': 'Feature',
        'properties': {
          'line-width':3,
          'color': colorsSpeed[indexCor].color,
          'velocidade': dadosVeiculo.ras_eve_velocidade,
          'dt_gps': dadosVeiculo.ras_eve_data_gps,
          'desc_ativo': dadosVeiculo.ras_vei_veiculo,
          'ignicao': dadosVeiculo.ras_eve_ignicao
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': ultimaPosicaoVeiculo.current[dadosVeiculo.ras_vei_id]
        }
      })

      map.getSource(`rota`).setData(rotaAtual)

      ultimaPosicaoVeiculo.current[dadosVeiculo.ras_vei_id] = [];
      ultimaPosicaoVeiculo.current[dadosVeiculo.ras_vei_id] = [coordenadas]

    }


    // ------------------------------------------------

    // if (sourceLine.hasOwnProperty(dadosVeiculo.ras_vei_id)) {

    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id].push(coordenadas);
    //   rotaAtual = map.getSource(`source_${dadosVeiculo.ras_vei_id}`)._data;

    //   rotaAtual.features.push({
    //     'type': 'Feature',
    //     'properties': {
    //       'color': colorsSpeed[indexCor].color,
    //       'velocidade': dadosVeiculo.ras_eve_velocidade,
    //       'dt_gps': dadosVeiculo.ras_eve_data_gps,
    //       'desc_ativo': dadosVeiculo.ras_vei_veiculo,
    //       'ignicao': dadosVeiculo.ras_eve_ignicao
    //     },
    //     'geometry': {
    //       'type': 'LineString',
    //       'coordinates': ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id]
    //     }
    //   })

    //   map.getSource(`source_${dadosVeiculo.ras_vei_id}`).setData(rotaAtual)

    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id] = [];
    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id] = [coordenadas]

    // } else {

    //   sourceLine[dadosVeiculo.ras_vei_id] = [];
    //   sourceLine[dadosVeiculo.ras_vei_id] = {
    //     features: [],
    //     type: "FeatureCollection"
    //   }

    //   map.addSource(`source_${dadosVeiculo.ras_vei_id}`, {
    //     'type': 'geojson',
    //     'data': sourceLine[dadosVeiculo.ras_vei_id],
    //   });


    //   map.addLayer({
    //     'id': `source_${dadosVeiculo.ras_vei_id}`,
    //     'type': 'line',
    //     'source': `source_${dadosVeiculo.ras_vei_id}`,
    //     'layout': {
    //       'line-join': 'round',
    //       'line-cap': 'round',
    //     },
    //     'paint': {
    //       'line-color': ['get', 'color'],
    //       'line-width': 3,
    //     }
    //   });

    //   // map.jumpTo({ 'center': coordenadas, 'zoom': 15 });

    //   indexCor = calcColorSpeed(dadosVeiculo.ras_eve_velocidade, operacaoConfig.velocidade);

    //   if (!ultimaPosicaoVeiculo.hasOwnProperty(dadosVeiculo.ras_vei_id)) {
    //     ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id] = [];
    //     ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id].push(coordenadas)
    //   }

    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id].push(coordenadas);

    //   rotaAtual = map.getSource(`source_${dadosVeiculo.ras_vei_id}`)._data;
    //   rotaAtual.features.push({
    //     'type': 'Feature',
    //     'properties': {
    //       'color': colorsSpeed[indexCor].color,
    //       'velocidade': dadosVeiculo.ras_eve_velocidade,
    //       'dt_gps': dadosVeiculo.ras_eve_data_gps,
    //       'desc_ativo': dadosVeiculo.ras_vei_veiculo,
    //       'ignicao': dadosVeiculo.ras_eve_ignicao,
    //     },
    //     'geometry': {
    //       'type': 'LineString',
    //       'coordinates': ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id]
    //     }
    //   })

    //   map.getSource(`source_${dadosVeiculo.ras_vei_id}`).setData(rotaAtual)

    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id] = [];
    //   ultimaPosicaoVeiculo[dadosVeiculo.ras_vei_id] = [coordenadas]
    // }

    if (sourceMarkerIndex.hasOwnProperty(dadosVeiculo.ras_vei_id)) {
      let allFeaturesMarkers = map.getSource('markersSymbol')._data;
      aux.featureMarkerAtual = allFeaturesMarkers.features[sourceMarkerIndex[dadosVeiculo.ras_vei_id]];

      aux.featureMarkerAtual.geometry.coordinates = coordenadas;
      aux.featureMarkerAtual.properties.image_marker = parseInt(dadosVeiculo.ras_eve_ignicao, 10) ? (parseInt(dadosVeiculo.ras_eve_velocidade, 10) > 0 ? 'marker-movimento' : 'marker-ligado') : 'marker-desligado';
      aux.featureMarkerAtual.properties.velocidade = dadosVeiculo.ras_eve_velocidade;
      aux.featureMarkerAtual.properties.dt_gps = dadosVeiculo.ras_eve_data_gps;
      aux.featureMarkerAtual.properties.desc_ativo = dadosVeiculo.ras_vei_veiculo;
      aux.featureMarkerAtual.properties.ignicao = dadosVeiculo.ras_eve_ignicao;

      allFeaturesMarkers.features[sourceMarkerIndex[dadosVeiculo.ras_vei_id]] = aux.featureMarkerAtual;

      map.getSource('markersSymbol').setData(allFeaturesMarkers)

    } else {

      sourceMarkerIndex[dadosVeiculo.ras_vei_id] = sourceMarker.features.length;
      sourceMarker.features.push(turf.point(coordenadas, {
        image_marker: parseInt(dadosVeiculo.ras_eve_ignicao, 10) ? (parseInt(dadosVeiculo.ras_eve_velocidade, 10) > 0 ? 'marker-movimento' : 'marker-ligado') : 'marker-desligado',
        velocidade: dadosVeiculo.ras_eve_velocidade,
        dt_gps: dadosVeiculo.ras_eve_data_gps,
        desc_ativo: dadosVeiculo.ras_vei_veiculo,
        ignicao: dadosVeiculo.ras_eve_ignicao,
      }))

      map.getSource('markersSymbol').setData(sourceMarker)

    }

    // map.panTo([parseFloat(dadosVeiculo.ras_eve_longitude), parseFloat(dadosVeiculo.ras_eve_latitude)]);

  }

  function buscarDados(form, map) {

    if (map && map.getSource('rota')) {
      map.removeSource('rota');
    }

    api.post('/relatorio/Rota/gerar/', form, (res) => {
      if (res.status) {
        var data = res.data;
        // let posicoesTratadas = data.map((row) => {
        //   return [row.lst_localizacao[1], row.lst_localizacao[0]]
        // })

        for (var i in data) {
          // INVERTENDO AS POSCISAO DAS COORDENADAS
          
          let prox = parseInt(i) + 1;
          if (
            (data.length - 1) >= prox &&
            data[i].lst_localizacao[0] == data[prox].lst_localizacao[0] && 
            data[i].lst_localizacao[1] == data[prox].lst_localizacao[1]
         ) {
             delete data[i];
         } else if ((data.length - 1) >= i){
          data[i].lst_localizacao = [data[i].lst_localizacao[1], data[i].lst_localizacao[0]];
         }
        }
        data = Object.values(data);
        setDados(data);
        // zoomRota(posicoesTratadas, map);
      } else {
        store.addNotification({
          title: "Erro ao trazer a rota!",
          message: res.message,
          type: "warning",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      }
    })
  }

  async function onLoadMap(map) {

    setMap(map);
    addPopupRota(map);

    let { id } = props.match.params;

    map.addControl(new ZoomControl(), 'top-left');

    if (id) {
      let operacaoAtual = props.location.state;
      operacaoAtual.tal_coordenada = JSON.parse(operacaoAtual.tal_coordenada);

      console.log(operacaoAtual);
      setOperacao(operacaoAtual);

      setOperacaoConfig({
        cerca: turf.polygon(operacaoAtual.tal_coordenada),
        velocidade: parseInt(operacaoAtual.osr_velocidade, 10)
      });

      addTalhaoOrdemServico(operacaoAtual, map, { contorno: true, linestalhao: true, fillColor: 'white', fillOpacity: 0.1 });
      addMacrosOrdemServico(operacaoAtual, map);

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

        configMapaOperacaoAndamento(map, id);
      }
      addPopupVeiculo(map);
    }
  }
 

  function addPopupRota(map) {
    var popupRota = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mousemove', 'rota', (e) => {
      popupRota.setLngLat(e.lngLat)
      .setHTML(templatePopup(e.features[0].properties))
      .addTo(map);
    });

    map.on('mouseleave', 'rota', function () {
      map.getCanvas().style.cursor = '';
      popupRota.remove();
    });
  }

  function configMapaOperacaoAndamento(map, id) {
    imagesMarkersVeiculo.forEach(item => {
      map.loadImage(item.url, function (error, image) {
        map.addImage(item.nome, image)
      })
    });

    var aux = {
      rotaAtual: [],
      indexCor: null,
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

  function addPopupVeiculo(map) {
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


  function zoomRota(posicoes, map) {
    var bounds = posicoes.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(posicoes[0], posicoes[0]));

    map.fitBounds(bounds, {
      padding: 20
    });
  }

  function addMacrosOrdemServico(orderServico, map) {

    if (orderServico.hasOwnProperty('macros')) {
      imagesMarkersMacro.forEach(item => {
        map.loadImage(item.url, function (error, image) {
          map.addImage(item.nome, image)
        })
      });

      var featuresMarkersMacro = [], lineMacro = [];
      var nomeImageMacro = "";

      for (var i in orderServico.macros) {

        switch (orderServico.macros[i].mac_macro) {
          case 'pausar':
            nomeImageMacro = "macro-pausar";
            break;
          case 'deslocamento':
            nomeImageMacro = "macro-deslocamento";
            break;
          case 'iniciar':
            nomeImageMacro = "macro-iniciar";
            break;
          case 'finalizar':
            nomeImageMacro = "macro-finalizar";
            break;
          default:
            nomeImageMacro = "macro-iniciar";
            break
        }

        orderServico.macros[i].mac_localizacao = JSON.parse(orderServico.macros[i].mac_localizacao).reverse();

        lineMacro.push(orderServico.macros[i].mac_localizacao);
        featuresMarkersMacro.push({
          'type': 'Feature',
          'properties': {
            'desc_macro': orderServico.macros[i].mac_macro,
            'image_macro': nomeImageMacro
          },
          'geometry': {
            'type': 'Point',
            'coordinates': orderServico.macros[i].mac_localizacao
          }
        })
      }


      map.addSource('markersMacroSymbol', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': featuresMarkersMacro
        }
      });

      map.addSource('lineMacro', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [lineMacro]
          },
          'properties': {}
        }
      })


      map.addLayer({
        'id': 'markersMacroSymbol',
        'type': 'symbol',
        'source': 'markersMacroSymbol',
        'layout': {
          'icon-size': 1,
          'icon-image': ['get', 'image_macro'],
          'icon-allow-overlap': true,
          // 'icon-ignore-placement':true,
          // get the title name from the source's "title" property
          'text-field': ['get', 'desc_macro'],
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
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

      map.addLayer({
        'id': 'macro_line',
        'type': 'line',
        'source': 'lineMacro',
        'layout': {},
        'paint': {
          'line-color': 'white',
          'line-width': 2,
          'line-dasharray': [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      })
    }

  }

  async function addTalhaoOrdemServico(orderServico, map, config = {}) {

    // GEOJSON TALHAO
    let areaTalhaoMetrosQuadrados = turf.area(turf.polygon(orderServico.tal_coordenada));
    let areaTalhaoHectares = turf.convertArea(areaTalhaoMetrosQuadrados, 'meters', 'kilometers');

    console.log(areaTalhaoMetrosQuadrados + " Metros qudrados Talhão");
    // console.log(areaTalhaoHectares + " Hectares");

    let featureTalhao = {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': orderServico.tal_coordenada
      },
      'properties': {
        'talhao': orderServico.tal_descricao,
        'cultura': orderServico.cul_descricao,
        'area_talhao': areaTalhaoHectares
      }
    }

    // ADD GEOJSON

    if (map.getSource('talhao')) {
      map.getSource('talhao').setData(featureTalhao);
    } else {
      map.addSource('talhao', {
        'type': 'geojson',
        'data': featureTalhao
      })
    }

    // ADD LAYER BACKGROUND TALHAO
    if (map.getLayer('talhao_fill')) {
      map.removeLayer('talhao_fill');
    } 

    map.addLayer({
      'id': 'talhao_fill',
      'type': 'fill',
      'source': 'talhao',
      'layout': {},
      'paint': {
        'fill-color': config.fillColor,
        'fill-opacity': config.fillOpacity,
        'fill-outline-color': 'black'
      }
    });

    if (config.contorno) {
      // ADD LAYER CONTORNO TALHAO
      if (map.getLayer('talhao_contorno')) {
        map.removeLayer('talhao_contorno');
      } 

      map.addLayer({
        'id': 'talhao_contorno',
        'type': 'line',
        'source': 'talhao',
        'layout': {},
        'paint': {
          'line-color': 'black',
          'line-width': 4
        }
      });
    }

    if (config.linestalhao && orderServico.tal_coordenada_line) {
      let retorno = await fetch(orderServico.tal_coordenada_line);
      let geojsonLineTalhao = await retorno.json();

      if (config.hasOwnProperty('dadosVeiculo')) {
        geojsonLineTalhao = formatLineInMap.lineOfComplete(geojsonLineTalhao, config.dadosVeiculo);
      }

      if (map.getSource('talhao_line')) {
        map.getSource('talhao_line').setData(geojsonLineTalhao)
      } else {
        map.addSource('talhao_line', {
          'type': 'geojson',
          'data': geojsonLineTalhao
        });
      } 

      if (map.getLayer('layer_talhao_line')) {
        map.removeLayer('layer_talhao_line');
      } 

      map.addLayer({
        'id': 'layer_talhao_line',
        'type': 'line',
        'source': 'talhao_line',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': ['get','color'],
          'line-width': 10
        }
      });

      console.log(`add linhas`);
      
      // popup talhao teste
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
  
      map.on('click', 'layer_talhao_line', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates[0].slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
  
        popup.setLngLat(coordinates).setHTML(`<div>${e.features[0].properties.name_talhao}</div>`).addTo(map);
      });
  
      // fim popup talhao teste
      
    } else {
      if (map.getLayer('layer_talhao_line')) {
        map.removeLayer('layer_talhao_line');
        map.removeSource('talhao_line');
      }
    }

    // DAR ZOOM NO TALHAO DA ORDEM DE SERVICO
    var bounds = orderServico.tal_coordenada[0].reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(orderServico.tal_coordenada[0][0], orderServico.tal_coordenada[0][0]));

    map.fitBounds(bounds, {
      padding: 20,
      offset: [5, 5]
    });
  }

  function onClickRota(e, map, popup) {
    popup.setLngLat(e.lngLat)
      .setHTML(templatePopup(e.features[0].properties))
      .addTo(map);
  }

  function templatePopup(obj) {
    let color = parseInt(obj.ignicao, 10) ? (parseInt(obj.velocidade, 10) > 0 ? '#3972EE' : '#0A6249') : '#F5F5F5';
    let backgroud = parseInt(obj.ignicao, 10) ? (parseInt(obj.velocidade, 10) > 0 ? '#E6EEFF' : '#90ee9080') : '#8E969B';
    return `<div id="popup">
              <div class="info_popup popup_ignicao" style="color:${color}; background:${backgroud}">
                ${parseInt(obj.ignicao, 10) ? "ON" : "OFF"}
              </div>
              <div class="info_popup popup_velocidade">
                ${obj.velocidade} km/h
              </div>
              <div class="info_popup popup_dt_gps">
                ${obj.dt_gps}
              </div>
            </div>`
  }

  async function onChangeMapSelectMap(value) {
    if (map.getSource("rota")) {
      map.removeLayer("rota");
      map.removeSource("rota");
    }

    if (value === 'velocidade') {
      await addTalhaoOrdemServico(operacao, map, { contorno: true, linestalhao: true, fillColor: 'white', fillOpacity: 0.1 });
      let geojson = formatLineInMap.lineOfSpeed(dados, operacaoConfig.velocidade);
      addRotaVeiculo(map, geojson);
    } else if (value === 'eficiencia') {
      await addTalhaoOrdemServico(operacao, map, { contorno: false, linestalhao: false, fillColor: 'red', fillOpacity: 0.7});
      let geojson = formatLineInMap.lineOfWidht(dados, operacaoConfig.cerca);
      addRotaVeiculo(map, geojson);
    } else if (value == 'streetComplete') {
      await addTalhaoOrdemServico(operacao, map, { contorno: false, linestalhao: true, fillColor: 'white', fillOpacity: 0.1, dadosVeiculo: dados});
    }
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
    <React.Fragment>
      <MapBox onStyleLoad={onLoadMap} {...mapOptions} />
      <Filtro onChangeMapSelectMap={onChangeMapSelectMap} />
      {/* <Carrosel operacao={operacao} consolidado={dadosConsolidado} /> */}
    </React.Fragment>
  );
}

export default MapaGeral;
