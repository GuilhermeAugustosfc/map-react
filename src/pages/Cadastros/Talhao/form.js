import React, { useEffect, useRef, useState } from 'react'

import MapBox from '../../../Componentes/MapBox/mapboxExport';

import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useHistory } from "react-router";

import api from '../../../services/api'

import 'mapbox-gl-controls/theme.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '../../../Componentes/MapBox/mapbox.css'

import './form.css'

function TalhaoForm(props) {

    var history = useHistory();

    const [codigo, setCodigo] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [areaUtil, setAreaUtil] = useState(0);
    const [coordenadasTalhao, setCoordenadasTalhao] = useState([]);
    const [id_talhao, setIdTalhao] = useState(0);

    const mapContainer = useRef(null);

    const [mapOptions, setMapOptions] = useState({
        center: [-49.654063, -22.215288],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: [12],
        containerStyle: {
            height: '70vh',
            width: '94vw',
        }
    })

    var draw = null;

    function atualizaDadosEdicao(talhao) {
        setAreaUtil(talhao.tal_area_util)
        setCodigo(talhao.tal_codigo || 0)
        setDescricao(talhao.tal_descricao)

        setCoordenadasTalhao(talhao.tal_coordenada);
        let coordinates = JSON.parse(talhao.tal_coordenada);

        let { map } = mapContainer.current.state;

        let feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': coordinates
            },
            'properties': {
                'talhao': talhao.tal_descricao,
                'area': talhao.tal_area_util
            }
        }
        draw.add(feature);

        var bounds = coordinates[0].reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]));


        map.fitBounds(bounds, {
            padding: 20,
            offset: [5, 5]

        });
    }

    function onLoadMap(map) {

        addMapBoxControll(map);

        let { id } = props.match.params;

        if (id) {

            setIdTalhao(id);

            api.get(`http://f-agro-api.fulltrackapp.com/talhao/${id}`, {}, ({ data }) => {
                var talhao = data[0];
                atualizaDadosEdicao(talhao)

            })
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

        map.on('draw.create', () => updateTalhao(map));
        map.on('draw.update', () => updateTalhao(map));
    }

    function updateTalhao(map) {
        var data = draw.getAll();
        if (data.features.length > 0) {
            var talhaoLatLon = data.features[0].geometry.coordinates[0];
            setCoordenadasTalhao(JSON.stringify(talhaoLatLon));

            var bounds = talhaoLatLon.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(talhaoLatLon[0], talhaoLatLon[0]));

            map.fitBounds(bounds, {
                padding: 20,
                offset: [5, 5]
            });

            // map.jumpTo({ 'center': talhaoLatLon[0], 'zoom': 13 });
        }
    }

    function saveTalhao() {

        // let { map } = mapContainer.current.state;
        // var img = map.getCanvas().toDataURL();
        let form = new FormData();

        form.append('tal_codigo', codigo);
        form.append('tal_descricao', descricao);
        form.append('tal_area_util', areaUtil);
        form.append('tal_coordenada', coordenadasTalhao);
        // tal_image: img

        if (id_talhao > 0) {
            api.put(`http://f-agro-api.fulltrackapp.com/talhao/${id_talhao}`, form, (res) => {
                history.push(`/cadastros/talhao`);
            })
        } else {
            api.post('http://f-agro-api.fulltrackapp.com/talhao/', form, (res) => {
                history.push(`/cadastros/talhao`);
            })
        }
    }

    return (
        <div className="container-form">
            <div className="col-md-12 form">
                <div className="input-group">
                    <label>Descrição do talhão</label>
                    <input className="form-control" value={descricao} type="text" alt="digite a descricao do talhao" placeholder="Digite a descrição do talhao" onChange={(e) => setDescricao(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Codigo</label>
                    <input className="form-control" value={codigo} type="text" alt="digite o codigo do talhao" placeholder="Digite o codigo do talhao" onChange={(e) => setCodigo(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Area util</label>
                    <input className="form-control" value={areaUtil} type="number" alt="digite A area util" placeholder="Digite a area util" onChange={(e) => setAreaUtil(e.target.value)} />
                </div>
                <div className="input-button">
                    <button className="btn btn-primary" onClick={saveTalhao}>Salvar</button>
                </div>
            </div>

            <input type="hidden" value={id_talhao} />

            <div className="col-md-12 container-mapa">
                <h3>Desenhe a area do talhão</h3>
                <div className="mapa">
                    <MapBox ref={mapContainer} onStyleLoad={onLoadMap} {...mapOptions} />
                </div>
            </div>
        </div>
    );
}

export default TalhaoForm;
