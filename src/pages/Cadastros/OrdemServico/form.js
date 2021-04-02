import React, { useRef, useState, useEffect } from 'react'

import MapBox from '../../../Componentes/MapBox/mapboxExport';

import mapboxgl from 'mapbox-gl';
import StylesControl from 'mapbox-gl-controls/lib/styles';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useHistory } from "react-router";

import api from '../../../services/api'

import moment from 'moment'

import './form.css'

function OrderServicoForm(props) {

    var history = useHistory();

    const mapContainer = useRef(null);

    const [mapOptions, setMapOptions] = useState({
        center: [-49.654063, -22.215288],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: [12],
        containerStyle: {
            height: '40vh',
            width: '526px',
            marginTop: '5px',
            borderRadius: '4px'
        }
    })
    const [idOrdemServico, setIdOrdemServico] = useState(0);

    const [idTalhao, setIdTalhao] = useState(0);
    const [talhoes, setTalhoes] = useState([]);

    const [idImplemento, setIdImplemento] = useState(0);
    const [implementos, setImplementos] = useState([]);

    const [idMotorista, setIdMotorista] = useState(0);
    const [motoristas, setMotoristas] = useState([]);

    const [idVeiculo, setIdVeiculo] = useState(0);
    const [veiculos, setVeiculos] = useState([]);

    const [idCultura, setIdCultura] = useState(0);
    const [culturas, setCulturas] = useState([]);

    const [idSafra, setIdSafra] = useState(0);
    const [safras, setSafras] = useState([]);

    const [idOperacao, setIdOperacao] = useState(0);
    const [operacoes, setOperacoes] = useState([]);

    const [idFazenda, setIdFazenda] = useState(0);
    const [fazendas, setFazendas] = useState([]);

    const [idAno, setIdAno] = useState(0);
    const [anos, setAnos] = useState([]);

    const [inicioPeriodo, setInicioPeriodo] = useState(moment(new Date().toLocaleDateString(), "DD/MM/YY").format("YYYY-MM-DD"));
    const [fimPeriodo, setFimPeriodo] = useState(moment(new Date().toLocaleDateString(), "DD/MM/YY").format("YYYY-MM-DD"));

    const [tempoCinquentaMetro, setTempoCinquentaMetro] = useState("01:00");

    const [velocidadeOrdemServico, setVelocidadeOrdemServico] = useState("01:00");

    const [rpmOrdemServico, setRpmOrdemServico] = useState("");

    const [combustivel, setCombustivel] = useState("");

    const [marchaOrdemServico, setMarchaOrdemServico] = useState("");

    const [draw, setDraw] = useState(null);

    function atualizaDadosEdicao(talhao) {

        if (talhao.tal_coordenada) {
            // setCoordenadasTalhao(talhao.tal_coordenada);
            // let coordinates = JSON.parse(talhao.tal_coordenada);

            // let { map } = mapContainer.current.state;

            // let feature = {
            //     'type': 'Feature',
            //     'geometry': {
            //         'type': 'Polygon',
            //         'coordinates': coordinates
            //     },
            //     'properties': {
            //         'talhao': talhao.tal_descricao,
            //         'area': talhao.tal_area_util
            //     }
            // }

            // draw.add(feature);

            // var bounds = coordinates[0].reduce(function (bounds, coord) {
            //     return bounds.extend(coord);
            // }, new mapboxgl.LngLatBounds(coordinates[0][0], coordinates[0][0]));

            // map.fitBounds(bounds, {
            //     padding: 20,
            //     offset: [5, 5]
            // });
        }
    }

    useEffect(() => {
        if (talhoes.length && mapContainer.current) {
            let { map } = mapContainer.current.state;

            let talhaoSelecionado = parseInt(idTalhao) > 0 ? talhoes.filter((talhao) => idTalhao === talhao.tal_id)[0] : talhoes[0];
            let coordenadasTalhao = JSON.parse(talhaoSelecionado.tal_coordenada);

            let feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': coordenadasTalhao
                },
                'properties': {
                    'talhao': talhaoSelecionado.tal_descricao,
                    'area': talhaoSelecionado.tal_area_util
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

            !map.getLayer('talhao') && map.addLayer({
                'id': 'talhao',
                'type': 'fill',
                'source': 'talhao',
                'layout': {},
                'paint': {
                    'fill-color': '#088',
                    'fill-opacity': 0.8
                }
            });

            var bounds = coordenadasTalhao[0].reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordenadasTalhao[0][0], coordenadasTalhao[0][0]));

            map.fitBounds(bounds, {
                padding: 20,
                offset: [5, 5]
            });

        }
    }, [talhoes, idTalhao])

    function onLoadMap(map) {

        addMapBoxControll(map);


        api.get(`http://f-agro-api.fulltrackapp.com/talhao`, {}, ({ data }) => {
            if (data.length) {
                setTalhoes(data);
            }
        });

        api.get(`http://f-agro-api.fulltrackapp.com/implemento`, {}, ({ data }) => {
            setImplementos(data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/motorista`, {}, ({ data }) => {
            setMotoristas(data.data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/veiculo`, {}, ({ data }) => {
            setVeiculos(data.data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/cultura`, {}, ({ data }) => {
            setCulturas(data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/safra`, {}, ({ data }) => {
            setSafras(data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/operacao`, {}, ({ data }) => {
            setOperacoes(data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/fazenda`, {}, ({ data }) => {
            setFazendas(data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/ano`, {}, ({ data }) => {
            setAnos(data);
        });



        let { id } = props.match.params;

        if (id) {

            setIdOrdemServico(id);

            api.get(`http://f-agro-api.fulltrackapp.com/ordemservico/${id}`, {}, ({ data }) => {
                var ordemServico = data[0];
            });
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

    }

    function saveOrdemServico() {

        // let { map } = mapContainer.current.state;
        // var img = map.getCanvas().toDataURL();
        let form = new FormData();

        // form.append('tal_codigo', codigo);
        // form.append('tal_descricao', descricao);
        // form.append('tal_area_util', areaUtil);
        // form.append('tal_coordenada', coordenadasTalhao);
        // tal_image: img

        if (idOrdemServico > 0) {
            api.put(`http://f-agro-api.fulltrackapp.com/talhao/${idOrdemServico}`, form, (res) => {
                history.push(`/cadastros/talhao`);
            })
        } else {
            api.post('http://f-agro-api.fulltrackapp.com/talhao/', form, (res) => {
                history.push(`/cadastros/talhao`);
            })
        }
    }

    return (
        <div className='container-ordem-servico'>
            <h3>CADASTRO DE ORDEM DE SERVIÇO</h3>
            <div className="col-md-6 form-group">
                <label className="label-form" id="labelOperacao">Operação</label>
                <select
                    htmlFor="labelOperacao"
                    id="selectOperacao"
                    className="select-form"
                    value={idOperacao}
                    onChange={(e) => setIdOperacao(e.target.value)}
                >
                    {operacoes.length && operacoes.map((operacao) => (
                        <option
                            key={operacao.ope_id}
                            value={operacao.ope_id}>
                            {operacao.ope_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelImpremento">Implemento</label>
                <select
                    htmlFor="labelImpremento"
                    id="selectImplemento"
                    className="select-form"
                    value={idImplemento}
                    onChange={(e) => setIdImplemento(e.target.value)}
                >
                    {implementos.length && implementos.map((imp) => (
                        <option
                            key={imp.imp_id}
                            value={imp.imp_id}>
                            {imp.imp_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelMotorista">Motorista</label>
                <select
                    htmlFor="labelMotorista"
                    id="selectMotorista"
                    className="select-form"
                    value={idMotorista}
                    onChange={(e) => setIdMotorista(e.target.value)}
                >
                    {motoristas.length && motoristas.map((mot) => (
                        <option
                            key={mot.ras_mot_id}
                            value={mot.ras_mot_id}>
                            {mot.ras_mot_nome}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelSafra">Safras</label>
                <select
                    htmlFor="labelSafra"
                    id="selectSafra"
                    className="select-form"
                    value={idSafra}
                    onChange={(e) => setIdSafra(e.target.value)}
                >
                    {safras.length && safras.map((safra) => (
                        <option
                            key={safra.saf_id}
                            value={safra.saf_id}>
                            {safra.saf_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelCultura">Culturas</label>
                <select
                    htmlFor="labelCultura"
                    id="selectCultura"
                    className="select-form"
                    value={idCultura}
                    onChange={(e) => setIdCultura(e.target.value)}
                >
                    {culturas.length && culturas.map((cultura) => (
                        <option
                            key={cultura.cul_id}
                            value={cultura.cul_id}>
                            {cultura.cul_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelVeiculos">Veiculos</label>
                <select
                    htmlFor="labelVeiculos"
                    id="selectVeiculos"
                    className="select-form"
                    value={idVeiculo}
                    onChange={(e) => setIdVeiculo(e.target.value)}
                >
                    {veiculos.length && veiculos.map((vei) => (
                        <option
                            key={vei.ras_vei_id}
                            value={vei.ras_vei_id}>
                            {vei.ras_vei_veiculo}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelFazenda">Fazendas</label>
                <select
                    htmlFor="labelFazenda"
                    id="selectFazendas"
                    className="select-form"
                    value={idFazenda}
                    onChange={(e) => setIdFazenda(e.target.value)}
                >
                    {fazendas.length && fazendas.map((fazenda) => (
                        <option
                            key={fazenda.faz_id}
                            value={fazenda.faz_id}>
                            {fazenda.faz_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelAno">Ano</label>
                <select
                    htmlFor="labelAno"
                    id="selectAnos"
                    className="select-form"
                    value={idAno}
                    onChange={(e) => setIdAno(e.target.value)}
                >
                    {anos.length && anos.map((anos) => (
                        <option
                            key={anos.ano_id}
                            value={anos.ano_id}>
                            {anos.ano_descricao}
                        </option>
                    ))}

                </select>
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelInicioPeriodo">Inicio periodo da operação</label>
                <input type="date" className="form-control" placeholder="Inicio do periodo da operação" value={inicioPeriodo} onChange={(e) => setInicioPeriodo(e.target.value)} />

                <label className="label-form" id="labelFimPeriodo">Fim periodo da operação</label>
                <input type="date" className="form-control" placeholder="Fim do periodo da operação" value={fimPeriodo} onChange={(e) => setFimPeriodo(e.target.value)} />

                <label className="label-form" id="labelTEmpoCinquentaMetro">Tempo cinquenta metros</label>
                <input type="time" className="form-control" placeholder="Quantos segundos o veículo percorreu em 50 metros" value={tempoCinquentaMetro} onChange={(e) => setTempoCinquentaMetro(e.target.value)} />

                <label className="label-form" id="labelVelocidadeOrdemServico">Velocidade de execuçaõ da operação</label>
                <input type="number" className="form-control" placeholder="Qual a velocidade (km/h) a odem de serviço deverá ser executada" value={velocidadeOrdemServico} onChange={(e) => setVelocidadeOrdemServico(e.target.value)} />

                <label className="label-form" id="labelRpmExecutada">Rpm de execuçaõ da operação</label>
                <input type="number" className="form-control" placeholder="Qual RPM a odem de serviço deverá ser executada" value={rpmOrdemServico} onChange={(e) => setRpmOrdemServico(e.target.value)} />

                <label className="label-form" id="labelCombustivel">Combustivel</label>
                <input type="number" className="form-control" placeholder="Digite o combustivel" value={combustivel} onChange={(e) => setCombustivel(e.target.value)} />

                <label className="label-form" id="labelMarchaExecucao">Marcha da execuçaõ da operação</label>
                <input type="number" className="form-control" placeholder="Qual marcha a odem de serviço deverá ser executada" value={marchaOrdemServico} onChange={(e) => setMarchaOrdemServico(e.target.value)} />
            </div>

            <div className="col-md-6 form-group">
                <label className="label-form" id="labelTalhao">Talhao</label>
                <select
                    htmlFor="labelTalhao"
                    id="selectTalhao"
                    className="select-form"
                    value={idTalhao}
                    onChange={(e) => {
                        setIdTalhao(e.target.value)
                    }}
                >
                    {talhoes.length && talhoes.map((talhao) => (
                        <option
                            key={talhao.tal_id}
                            value={talhao.tal_id}>
                            {talhao.tal_descricao}
                        </option>
                    ))}
                </select>
                <div className="mapa">
                    <MapBox ref={mapContainer} onStyleLoad={onLoadMap} {...mapOptions} />
                </div>
            </div>

            <input type="hidden" value={idOrdemServico} />

        </div>

    );
}

export default OrderServicoForm;
