import React, { useRef, useState } from 'react'

import MapBox from '../../../Componentes/MapBox/mapboxExport';

import mapboxgl from 'mapbox-gl';
// import StylesControl from 'mapbox-gl-controls/lib/styles';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import S3 from 'react-aws-s3';

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useHistory } from "react-router";

import api from '../../../services/api'
import shp from 'shpjs'

import './form.css'

function TalhaoForm(props) {

    var history = useHistory();

    const [codigo, setCodigo] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [areaUtil, setAreaUtil] = useState(0);
    const [coordenadasTalhao, setCoordenadasTalhao] = useState([]);
    const [id_talhao, setIdTalhao] = useState(0);
    const [fileNameTalhaoEdicao, setFileNameTalhaoEdicao] = useState(null);

    const [errorCodigo, setErrorCodigo] = useState("");
    const [errorDescricao, setErrorDescricao] = useState("");
    const [errorAreaUtil, setErrorAreaUtil] = useState("");
    const [errorCoordenadasTalhao, setErrorCoordenadasTalhao] = useState("");

    const [map, setMap] = useState(null);
    const selecionarFileRef = useRef(null);
    const [draw, setDraw] = useState(null);


    const [mapOptions, setMapOptions] = useState({
        center: [-49.654063, -22.215288],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: [12],
        containerStyle: {
            height: '70vh',
            width: '94vw',
        }
    })


    function updateDataEdit(map, talhao, draw) {
        setAreaUtil(talhao.tal_area_util);
        setCodigo(talhao.tal_codigo || 0);
        setDescricao(talhao.tal_descricao);
        setFileNameTalhaoEdicao(talhao.tal_imagem ? talhao.tal_imagem.split("talhao/")[1] : null);

        if (talhao.tal_coordenada) {
            let coordinates = JSON.parse(talhao.tal_coordenada);
            coordinates = coordinates.length === 1 ? coordinates : [coordinates];
            setCoordenadasTalhao(JSON.stringify(coordinates));

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
                // padding: 20,
                maxZoom: 15,
            });
        }
    }

    function onLoadMap(map) {

        setMap(map);

        var newDraw = addMapBoxControll(map);

        let { id } = props.match.params;

        if (id) {

            setIdTalhao(id);

            api.get(`http://f-agro-api.fulltrackapp.com/talhao/${id}`, {}, ({ data }) => {
                var talhao = data[0];
                updateDataEdit(map, talhao, newDraw)

            })
        }
    }

    function addMapBoxControll(map) {
        // map.addControl(new StylesControl({
        //     styles: [
        //         {
        //             label: 'Streets',
        //             styleName: 'Mapbox Streets',
        //             styleUrl: 'mapbox://styles/mapbox/streets-v9',
        //         },
        //         {
        //             label: 'Satellite',
        //             styleName: 'Satellite',
        //             styleUrl: 'mapbox://styles/mapbox/satellite-v9',

        //         },
        //         {
        //             label: 'Terreno',
        //             styleName: 'Terreno',
        //             styleUrl: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        //         },
        //     ],
        // }), 'top-left');

        var newDraw = new MapboxDraw({
            displayControlsDefault: false,
            userProperties: true,
            controls: {
                polygon: true,
                trash: true
            },
            styles: [
                {
                    "id": "gl-draw-polygon-fill",
                    "type": "fill",
                    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                    "paint": {
                        "fill-color": "#D20C0C",
                        "fill-outline-color": "#D20C0C",
                        "fill-opacity": 0.6
                    }
                },
                // polygon outline stroke
                // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
                {
                    "id": "gl-draw-polygon-stroke-active",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": "#D20C0C",
                        "line-dasharray": [0.2, 2],
                        "line-width": 2
                    }
                },
                // vertex point halos
                {
                    "id": "gl-draw-polygon-and-line-vertex-halo-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 5,
                        "circle-color": "#FFF"
                    }
                },
                // vertex points
                {
                    "id": "gl-draw-polygon-and-line-vertex-active",
                    "type": "circle",
                    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                    "paint": {
                        "circle-radius": 3,
                        "circle-color": "#D20C0C",
                    }
                },

                // INACTIVE (static, already drawn)
                // line stroke
                {
                    "id": "gl-draw-line-static",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": "#000",
                        "line-width": 3
                    }
                },
                // polygon fill
                {
                    "id": "gl-draw-polygon-fill-static",
                    "type": "fill",
                    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                    "paint": {
                        "fill-color": "#000",
                        "fill-outline-color": "#000",
                        "fill-opacity": 0.1
                    }
                },
                // polygon outline
                {
                    "id": "gl-draw-polygon-stroke-static",
                    "type": "line",
                    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                    "layout": {
                        "line-cap": "round",
                        "line-join": "round"
                    },
                    "paint": {
                        "line-color": "#000",
                        "line-width": 3
                    }
                }
            ]
        })

        map.addControl(newDraw, 'top-left');

        setDraw(newDraw);

        map.addControl(new ZoomControl(), 'top-left');

        map.on('draw.create', () => updateTalhao(map, newDraw));
        map.on('draw.update', () => updateTalhao(map, newDraw));

        return newDraw;
    }

    function updateTalhao(map, draw) {
        var data = draw.getAll();
        if (data.features.length > 0) {
            // draw.setFeatureProperty(data.features[0].id, 'fill-color', "black")

            setCoordenadasTalhao(JSON.stringify(data.features[0].geometry.coordinates));
            var talhaoLatLon = data.features[0].geometry.coordinates[0];

            var bounds = talhaoLatLon.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(talhaoLatLon[0], talhaoLatLon[0]));

            map.fitBounds(bounds, {
                padding: 20,
                maxZoom: 13,
            });

            // map.jumpTo({ 'center': talhaoLatLon[0], 'zoom': 13 });
        }
    }

    function dataURLtoFile(dataurl, filename) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    function generateHash(name) {
        var length = 50,
            retVal = "";
        for (var i = 0, n = name.length; i < length; ++i) {
            retVal += name.charAt(Math.floor(Math.random() * n));
        }
        return retVal.split('.').join('').split(' ').join('').split(',').join('').split('_').join('');
    };

    function clearInput() {
        setErrorCodigo(null);
        setErrorDescricao(null);
        setErrorAreaUtil(null);
        setErrorCoordenadasTalhao(null);

    }

    function validData() {

        clearInput();
        var valid = true;
        if (parseInt(codigo) <= 0) {
            setErrorCodigo("Codigo é obrigatorio*");
            valid = false;
        }

        if (!descricao || descricao.length === 0) {
            setErrorDescricao("Descrição é obrigatorio*");
            valid = false;

        }

        if (!areaUtil || areaUtil <= 0) {
            setErrorAreaUtil("Area é obrigatoria*");
            valid = false;

        }

        if (!coordenadasTalhao || coordenadasTalhao.length <= 0) {
            setErrorCoordenadasTalhao("Por favor desenhe o talhão ou import um shapefile*");
            valid = false;
        }

        return valid;
    }


    function saveTalhao() {
        if (validData()) {
            var img = map.getCanvas().toDataURL();
            var Data = new Date();
            var filename = fileNameTalhaoEdicao ? fileNameTalhaoEdicao : generateHash(`${descricao}_talhao.png` + Data.getHours.toString()
                + Data.getMinutes().toString() + Data.getSeconds().toString()
                + Data.getMilliseconds().toString() + Math.floor(Math.random() * 500));

            var file = dataURLtoFile(img, filename);

            const ReactS3Client = new S3({
                bucketName: process.env.REACT_APP_BUCKET_NAME,
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                region: process.env.REACT_APP_AWS_DEFAULT_REGION,
                dirName: process.env.REACT_APP_DIR_NAME
            });

            ReactS3Client.uploadFile(file, filename).then(({ location }) => {
                if (id_talhao > 0) {
                    // PUT REQUETS ONLY JSON DATA
                    api.put(`http://f-agro-api.fulltrackapp.com/talhao/${id_talhao}/`, {
                        tal_codigo: codigo,
                        tal_descricao: descricao,
                        tal_area_util: areaUtil,
                        tal_coordenada: coordenadasTalhao,
                        tal_imagem: location
                    }, (res) => {
                        history.push(`/cadastros/talhao`);
                    })

                } else {
                    // POST REQUETS ONLY FORM DATA

                    let form = new FormData();
                    form.append('tal_codigo', codigo);
                    form.append('tal_descricao', descricao);
                    form.append('tal_area_util', areaUtil);
                    form.append('tal_coordenada', coordenadasTalhao);
                    form.append('tal_imagem', location);

                    api.post('http://f-agro-api.fulltrackapp.com/talhao/', form, (res) => {
                        history.push(`/cadastros/talhao`);
                    })
                }
            }).catch((error) => {
                console.log('errro upload s3');
                console.log(error);
            });
        }
    }

    function backForm() {
        history.push(`/cadastros/talhao`);
    }

    function importarShapeFile() {
        const [file] = selecionarFileRef.current.files;

        // if (file.name.slice(-3) === 'zip') {
        return readFile(file);
        // } else {
        //     alert("Apenas arquivos zip");
        // }
    }

    function readFile(file) {
        var reader = new FileReader();
        reader.onload = readerLoad;
        reader.readAsArrayBuffer(file);
    }

    function readerLoad() {
        if (this.readyState === 2 && !this.error) {
            var geojson = shp.parseZip(this.result);
            var coordenadasShapefile = geojson.features[0].geometry.coordinates;

            if (coordenadasShapefile.length > 0) {
                coordenadasShapefile = coordenadasShapefile.length === 1 ? coordenadasShapefile : [coordenadasShapefile];
            }

            geojson.features[0].geometry.coordinates = coordenadasShapefile;
            geojson.features[0].geometry.type = "Polygon";

            draw.add(geojson);

            setCoordenadasTalhao(JSON.stringify(coordenadasShapefile));

            var bounds = coordenadasShapefile[0].reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordenadasShapefile[0][0], coordenadasShapefile[0][0]));

            map.fitBounds(bounds, {
                padding: 20,
                maxZoom: 15,
            });
        }
        else {
            alert('error read zip file')
        }
    }

    return (
        <div className="container-form">
            <div className="col-md-12 form">
                <div className="input-group">
                    <label>Descrição do talhão</label>
                    <input className="form-control" value={descricao} type="text" alt="digite a descricao do talhao" placeholder="Digite a descrição do talhao" onChange={(e) => setDescricao(e.target.value)} />
                    <p className="error-input">{errorDescricao}</p>
                </div>
                <div className="input-group">
                    <label>Codigo</label>
                    <input className="form-control" value={codigo} type="text" alt="digite o codigo do talhao" placeholder="Digite o codigo do talhao" onChange={(e) => setCodigo(e.target.value)} />
                    <p className="error-input">{errorCodigo}</p>

                </div>
                <div className="input-group">
                    <label>Area util</label>
                    <input className="form-control" value={areaUtil} type="number" alt="digite A area util" placeholder="Digite a area util" onChange={(e) => setAreaUtil(e.target.value)} />
                    <p className="error-input">{errorAreaUtil}</p>

                </div>
                <div className="input-button">
                    <button className="btn btn-primary" id="btn-salvar" onClick={saveTalhao}>Salvar</button>
                    <button className="btn btn-warning" id="btn-cancelar" onClick={backForm}>Cancelar</button>
                </div>
            </div>

            <input type="hidden" value={id_talhao} />

            <div className="import-group">
                <input ref={selecionarFileRef} className="btn" id="btn-selecionar-shape" type="file" />
                <button className="btn" id="btn-importar-shape" onClick={() => importarShapeFile()}>Importar</button>

            </div>

            <div className="col-md-12 container-mapa">
                <h3>Desenhe a area do talhão</h3>
                <p className="error-input">{errorCoordenadasTalhao}</p>

                <div className="mapa">
                    <MapBox onStyleLoad={onLoadMap} {...mapOptions} />
                </div>
            </div>
        </div>
    );
}

export default TalhaoForm;
