import React, { useRef, useState, useEffect } from 'react'
import MapBox from '../../../Componentes/MapBox/mapbox';
import mapboxgl from 'mapbox-gl';
import ZoomControl from 'mapbox-gl-controls/lib/zoom';
import { useHistory } from "react-router";
import api from '../../../services/api';
import DateRangePicker from "../../../Componentes/DataRangerPicker/DataRangerPicker";
import moment from 'moment';
import BotaoForm from "../../../Componentes/BotaoForm/botaoForm";

import { store } from 'react-notifications-component';


import { GoCheck, GoArrowLeft } from 'react-icons/go'

import Button from '@material-ui/core/Button';
import './form.css';

function OrderServicoForm(props) {

    var history = useHistory();

    const [map, setMap] = useState(null);

    const [mapOptions, setMapOptions] = useState({
        center: [-49.654063, -22.215288],
        style: "mapbox://styles/mapbox/satellite-v9",
        zoom: [12],
        containerStyle: {
            height: '40vh',
            width: '100%',
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

    const [inicioPeriodo, setInicioPeriodo] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    const [fimPeriodo, setFimPeriodo] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));

    const [tempoCinquentaMetro, setTempoCinquentaMetro] = useState("01:00");
    const [velocidadeOrdemServico, setVelocidadeOrdemServico] = useState(0);
    const [rpmOrdemServico, setRpmOrdemServico] = useState("");
    const [combustivel, setCombustivel] = useState("");
    const [marchaOrdemServico, setMarchaOrdemServico] = useState("");
    const [numeroOrdem, setNumeroOrdem] = useState("");

    const selectVeiculoRef = useRef(null);
    const selectMotoristaRef = useRef(null);

    const [errorOperacao, setErrorOperacao] = useState("");
    const [errorImplemento, setErrorImplemento] = useState("");
    const [errorSafra, setErrorSafra] = useState("");
    const [errorAno, setErrorAno] = useState("");
    const [errorMotorista, setErrorMotorista] = useState("");
    const [errorVeiculo, setErrorVeiculo] = useState("");
    const [errorCultura, setErrorCultura] = useState("");

    const [errorVelocidade, setErrorVelocidade] = useState("");
    const [errorTalhao, setErrorTalhao] = useState("");
    const [errorFazenda, setErrorFazenda] = useState("");
    const [errorNumeroOrdem, setErrorNumeroOrdem] = useState("");



    useEffect(() => {
        if (idTalhao && map && talhoes.length) {

            let talhaoSelecionado = talhoes.filter((talhao) => idTalhao === talhao.tal_id)[0]
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
    }, [talhoes, idTalhao, map])

    function onLoadMap(map) {

        setMap(map)

        map.addControl(new ZoomControl());

        api.get(`/talhao`, {}, ({ data }) => {
            if (data.length) {
                setTalhoes(data);
            }
        });

        api.get(`/implemento`, {}, ({ data }) => {
            setImplementos(data);
        });

        api.get(`/motorista`, {}, ({ data }) => {
            setMotoristas(data.data);
        });

        api.get(`/veiculo`, {}, ({ data }) => {
            setVeiculos(data.data);
        });

        api.get(`/cultura`, {}, ({ data }) => {
            setCulturas(data);
        });

        api.get(`/safra`, {}, ({ data }) => {
            setSafras(data);
        });

        api.get(`/operacao`, {}, ({ data }) => {
            setOperacoes(data);
        });

        api.get(`/fazenda`, {}, ({ data }) => {
            setFazendas(data);
        });

        api.get(`/ano`, {}, ({ data }) => {
            setAnos(data);
        });

        let { id } = props.match.params;

        if (id) {

            setIdOrdemServico(id);

            api.get(`/ordemservico/${id}`, {}, ({ data }) => {
                var ordemServico = data[0];
                setIdOperacao(ordemServico.osr_id_operacao);
                setCombustivel(ordemServico.osr_cons_combustivel);
                setIdOrdemServico(ordemServico.osr_id);
                setIdAno(ordemServico.osr_id_ano);
                setIdCultura(ordemServico.osr_id_cultura);
                setIdFazenda(ordemServico.osr_id_fazenda);
                setIdTalhao(ordemServico.osr_id_talhao);
                setNumeroOrdem(ordemServico.osr_codigo);
                setIdImplemento(ordemServico.osr_id_implemento);
                setIdMotorista(ordemServico.osr_id_motorista);
                setIdOperacao(ordemServico.osr_id_operacao);
                setIdSafra(ordemServico.osr_id_safra);
                setIdVeiculo(ordemServico.osr_id_veiculo);
                setMarchaOrdemServico(ordemServico.osr_marcha);
                setInicioPeriodo(moment(ordemServico.osr_periodo_ini, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss"));
                setFimPeriodo(moment(ordemServico.osr_periodo_fim, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss"));
                setRpmOrdemServico(ordemServico.osr_rpm);
                setTempoCinquentaMetro(ordemServico.osr_tmp_cinq_metros);
                setVelocidadeOrdemServico(ordemServico.osr_velocidade);
            });
        }
    }

    function clearError() {
        setErrorAno("");
        setErrorOperacao("");
        setErrorVeiculo("");
        setErrorVeiculo("");
        setErrorCultura("");
        setErrorFazenda("");
        setErrorTalhao("");
        setErrorSafra("");
        setErrorMotorista("");
        setErrorVelocidade("");
        setErrorNumeroOrdem("")
    }

    function validDataOrdemServices() {

        clearError()

        let valid = true;

        if (!idAno) {
            setErrorAno("error-border ano");
            valid = false;
        }

        if (!idOperacao) {
            setErrorOperacao("error-border operação");
            valid = false;
        }

        if (!idVeiculo) {
            setErrorVeiculo("error-border veiculo");
            valid = false;
        }

        if (!idImplemento) {
            setErrorImplemento("error-border veiculo");
            valid = false;
        }

        if (!idCultura) {
            setErrorCultura("error-border cultura");
            valid = false;
        }

        if (!idFazenda) {
            setErrorFazenda("error-border fazenda");
            valid = false;
        }

        if (!idTalhao) {
            setErrorTalhao("error-border talhão");
            valid = false;
        }

        if (!idSafra) {
            setErrorSafra("error-border safra");
            valid = false;
        }

        if (!idMotorista) {
            setErrorMotorista("error-border motorista");
            valid = false;
        }

        if (!velocidadeOrdemServico) {
            setErrorVelocidade("error-border");
            valid = false;
        }

        if (!numeroOrdem) {
            setErrorNumeroOrdem("error-border")
        }

        return valid;
    }

    function saveOrdemService() {

        if (validDataOrdemServices()) {
            if (idOrdemServico > 0) {
                api.put(`/ordemservico/${idOrdemServico}`, {
                    osr_id_operacao: idOperacao,
                    osr_id_veiculo: idVeiculo,
                    osr_id_implemento: idImplemento,
                    osr_id_cultura: idCultura,
                    osr_id_fazenda: idFazenda,
                    osr_id_talhao: idTalhao,
                    osr_id_safra: idSafra,
                    osr_id_ano: idAno,
                    osr_codigo: numeroOrdem,
                    osr_id_motorista: idMotorista,
                    osr_periodo_ini: moment(inicioPeriodo, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
                    osr_periodo_fim: moment(fimPeriodo, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
                    osr_tmp_cinq_metros: tempoCinquentaMetro,
                    osr_velocidade: velocidadeOrdemServico,
                    osr_rpm: rpmOrdemServico,
                    osr_cons_combustivel: combustivel,
                    osr_marcha: marchaOrdemServico,
                    osr_motorista: selectMotoristaRef.current.options[selectMotoristaRef.current.selectedIndex].text,
                    osr_veiculo: selectVeiculoRef.current.options[selectVeiculoRef.current.selectedIndex].text
                }, (res) => {
                    if (res.status) {
                        history.push(`/cadastros/ordemservico`);
                    } else {
                        store.addNotification({
                            title: "Erro ao salvar!",
                            message: res.message,
                            type: "danger",
                            insert: "bottom",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                                duration: 15000,
                                onScreen: true
                            }
                        });
                    }
                })
            } else {

                let form = new FormData();

                form.append('osr_data_emissao', moment(new Date().toLocaleDateString(), "DD/MM/YY").format("YYYY-MM-DD"));
                form.append('osr_id_operacao', idOperacao);
                form.append('osr_id_veiculo', idVeiculo);
                form.append('osr_id_implemento', idImplemento);
                form.append('osr_id_cultura', idCultura);
                form.append('osr_id_talhao', idTalhao);
                form.append('osr_id_fazenda', idFazenda);
                form.append('osr_id_safra', idSafra);
                form.append('osr_id_ano', idAno);
                form.append('osr_codigo', numeroOrdem);
                form.append('osr_id_motorista', idMotorista);
                form.append('osr_periodo_ini', moment(inicioPeriodo, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
                form.append('osr_periodo_fim', moment(fimPeriodo, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
                form.append('osr_tmp_cinq_metros', tempoCinquentaMetro);
                form.append('osr_velocidade', velocidadeOrdemServico);
                form.append('osr_rpm', rpmOrdemServico);
                form.append('osr_cons_combustivel', combustivel);
                form.append('osr_marcha', marchaOrdemServico);
                form.append('osr_motorista', selectMotoristaRef.current.options[selectMotoristaRef.current.selectedIndex].text);
                form.append('osr_veiculo', selectVeiculoRef.current.options[selectVeiculoRef.current.selectedIndex].text);


                api.post('/ordemservico/', form, (res) => {
                    if (res.status) {
                        history.push(`/cadastros/ordemservico`);
                    } else {
                        store.addNotification({
                            title: "Erro ao salvar!",
                            message: res.message,
                            type: "danger",
                            insert: "bottom",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                                duration: 15000,
                                onScreen: true
                            }
                        });
                    }
                })
            }
        }
    }

    function onChangeData(ev, picker) {
        setInicioPeriodo(picker.startDate.format('DD/MM/YYYY HH:mm:ss'))
        setFimPeriodo(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
    }

    function cancelarOrdemServico() {
        history.push('/cadastros/ordemservico')
    }

    return (
        <div className='container-ordem-servico'>
            <h3>CADASTRO DE ORDEM DE SERVIÇO</h3>

            <div className="col-md-6">
                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Ordem
                    </div>
                    <label className="label-form-ordem-servico" id="labelDataEmissao">Data emissão</label>

                    <DateRangePicker
                        onChangeData={onChangeData}
                        startDate={inicioPeriodo}
                        endDate={fimPeriodo}
                    />
                    <label className="label-form-ordem-servico" id="labelNumero">Numero</label>
                    <input type="number" className={`form-control ${errorNumeroOrdem}`} placeholder="Numero da ordem de serviço" value={numeroOrdem} onChange={(e) => setNumeroOrdem(e.target.value)} />

                </div>

                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Culturas
                    </div>
                    <label className="label-form-ordem-servico" id="labelCultura">Culturas</label>
                    <BotaoForm chaveId={"cul_id"} chaveDesc={"cul_descricao"} states={setCulturas} valor={culturas} id={idCultura} url={"cultura"} >
                        <select
                            htmlFor="labelCultura"
                            id="selectCultura"
                            className={`select-form ${errorCultura}`}
                            value={idCultura}
                            onChange={(e) => setIdCultura(e.target.value)}
                        >
                            <option
                                key="0"
                                value=""
                            >
                                Nenhum Selecionado
                            </option>
                            {culturas && culturas.length && culturas.map((cultura) => (
                                <option
                                    key={cultura.cul_id}
                                    value={cultura.cul_id}>
                                    {cultura.cul_descricao}
                                </option>
                            ))}

                        </select>
                    </BotaoForm>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, marginRight: '11px' }}>
                            <label className="label-form-ordem-servico" id="labelAno">Ano</label>

                            <BotaoForm chaveId={"ano_id"} chaveDesc={"ano_descricao"} states={setAnos} valor={anos} id={idAno} url={"ano"} >
                                <select
                                    htmlFor="labelAno"
                                    id="selectAnos"
                                    className={`select-form ${errorAno}`}
                                    value={idAno}
                                    onChange={(e) => setIdAno(e.target.value)}
                                >
                                    <option
                                        key="0"
                                        value=""
                                    >
                                        Nenhum Selecionado
                                    </option>
                                    {anos && anos.length && anos.map((anos) => (
                                        <option
                                            key={anos.ano_id}
                                            value={anos.ano_id}>
                                            {anos.ano_descricao}
                                        </option>
                                    ))}

                                </select>
                            </BotaoForm>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="label-form-ordem-servico" id="labelSafra">Safras</label>
                            <BotaoForm chaveId={"saf_id"} chaveDesc={"saf_descricao"} states={setSafras} valor={safras} id={idSafra} url={"safra"} >
                                <select
                                    htmlFor="labelSafra"
                                    id="selectSafra"
                                    className={`select-form ${errorSafra}`}
                                    value={idSafra}
                                    onChange={(e) => setIdSafra(e.target.value)}
                                >
                                    <option
                                        key="0"
                                        value=""
                                    >
                                        Nenhum Selecionado
                                    </option>
                                    {safras && safras.length && safras.map((safra) => (
                                        <option
                                            key={safra.saf_id}
                                            value={safra.saf_id}>
                                            {safra.saf_descricao}
                                        </option>
                                    ))}

                                </select>
                            </BotaoForm>
                        </div>
                    </div>

                    <label className="label-form-ordem-servico" id="labelFazenda">Fazendas</label>
                    <BotaoForm chaveId={"faz_id"} chaveDesc={"faz_descricao"} states={setFazendas} valor={fazendas} id={idFazenda} url={"fazenda"} >
                        <select
                            htmlFor="labelFazenda"
                            id="selectFazendas"
                            className={`select-form ${errorFazenda}`}
                            value={idFazenda}
                            onChange={(e) => setIdFazenda(e.target.value)}
                        >
                            <option
                                key="0"
                                value=""
                            >
                                Nenhum Selecionado
                            </option>
                            {fazendas && fazendas.length && fazendas.map((fazenda) => (
                                <option
                                    key={fazenda.faz_id}
                                    value={fazenda.faz_id}>
                                    {fazenda.faz_descricao}
                                </option>
                            ))}

                        </select>
                    </BotaoForm>
                </div>

                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Operação
                    </div>
                    <label className="label-form-ordem-servico" id="labelOperacao">Operação</label>
                    <BotaoForm chaveId={"ope_id"} chaveDesc={"ope_descricao"} states={setOperacoes} valor={operacoes} id={idOperacao} url={"operacao"} >

                        <select
                            htmlFor="labelOperacao"
                            id="selectOperacao"
                            className={`select-form ${errorOperacao}`}
                            value={idOperacao}
                            onChange={(e) => setIdOperacao(e.target.value)}
                        >
                            <option
                                key="0"
                                value=""
                            >
                                Nenhum Selecionado
                        </option>
                            {operacoes && operacoes.length && operacoes.map((operacao) => (
                                <option
                                    key={operacao.ope_id}
                                    value={operacao.ope_id}>
                                    {operacao.ope_descricao}
                                </option>
                            ))}

                        </select>
                    </BotaoForm>

                    <label className="label-periodo-ordemservico">Periodo</label>
                    <DateRangePicker
                        onChangeData={onChangeData}
                        startDate={inicioPeriodo}
                        endDate={fimPeriodo}
                    />

                </div>

                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Lavouras
                    </div>
                    <label className="label-form-ordem-servico" id="labelTalhao">Talhao</label>
                    <select
                        htmlFor="labelTalhao"
                        id="selectTalhao"
                        className={`select-form ${errorTalhao}`}
                        value={idTalhao}
                        onChange={(e) => {
                            setIdTalhao(e.target.value)
                        }}
                    >
                        <option
                            key="0"
                            value=""
                        >
                            Nenhum Selecionado
                    </option>
                        {talhoes && talhoes.length && talhoes.map((talhao) => (
                            <option
                                key={talhao.tal_id}
                                value={talhao.tal_id}>
                                {talhao.tal_descricao}
                            </option>
                        ))}
                    </select>

                    <div className="mapa">
                        <MapBox onStyleLoad={onLoadMap} {...mapOptions} />
                    </div>
                </div>

            </div>

            <div className="col-md-6">
                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Operadores
                    </div>
                    <label className="label-form-ordem-servico" id="labelMotorista">Motorista</label>
                    <select
                        htmlFor="labelMotorista"
                        id="selectMotorista"
                        className={`select-form ${errorMotorista}`}
                        ref={selectMotoristaRef}
                        value={idMotorista}
                        onChange={(e) => setIdMotorista(e.target.value)}
                    >
                        <option
                            key="0"
                            value=""
                        >
                            Nenhum Selecionado
                        </option>
                        {motoristas && motoristas.length && motoristas.map((mot) => (
                            <option
                                key={mot.ras_mot_id}
                                value={mot.ras_mot_id}>
                                {mot.ras_mot_nome}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Maquinas e implementos
                    </div>
                    <label className="label-form-ordem-servico" id="labelVeiculos">Veiculos</label>
                    <select
                        htmlFor="labelVeiculos"
                        id="selectVeiculos"
                        className={`select-form ${errorVeiculo}`}
                        ref={selectVeiculoRef}
                        value={idVeiculo}
                        onChange={(e) => setIdVeiculo(e.target.value)}
                    >
                        <option
                            key="0"
                            value=""
                        >
                            Nenhum Selecionado
                    </option>
                        {veiculos && veiculos.length && veiculos.map((vei) => (
                            <option
                                key={vei.ras_vei_id}
                                value={vei.ras_vei_id}>
                                {vei.ras_vei_veiculo}
                            </option>
                        ))}

                    </select>

                    <label className="label-form-ordem-servico" id="labelImpremento">Implemento</label>
                    <BotaoForm chaveId={"imp_id"} chaveDesc={"imp_descricao"} states={setImplementos} valor={implementos} id={idImplemento} url={"implemento"} >
                        <select
                            htmlFor="labelImpremento"
                            id="selectImplemento"
                            className={`select-form ${errorImplemento}`}
                            value={idImplemento}
                            onChange={(e) => setIdImplemento(e.target.value)}
                        >
                            <option
                                key="0"
                                value=""
                            >
                                Nenhum Selecionado
                        </option>
                            {implementos && implementos.length && implementos.map((imp) => (
                                <option
                                    key={imp.imp_id}
                                    value={imp.imp_id}>
                                    {imp.imp_descricao}
                                </option>
                            ))}

                        </select>
                    </BotaoForm>
                </div>

                <div className="form-group-ordem-servico">
                    <div className="form-group-ordem-servico-head">
                        Configuração da Ordem de serviço
                </div>
                    <label className="label-form-ordem-servico" id="labelTEmpoCinquentaMetro">Tempo cinquenta metros</label>
                    <input type="time" className={`form-control `} placeholder="Quantos segundos o veículo percorreu em 50 metros" value={tempoCinquentaMetro} onChange={(e) => setTempoCinquentaMetro(e.target.value)} />

                    <label className="label-form-ordem-servico" id="labelVelocidadeOrdemServico">Velocidade de execuçaõ da operação</label>
                    <input type="number" className={`form-control ${errorVelocidade}`} placeholder="Qual a velocidade (km/h) a odem de serviço deverá ser executada" value={velocidadeOrdemServico} onChange={(e) => setVelocidadeOrdemServico(e.target.value)} />

                    <label className="label-form-ordem-servico" id="labelRpmExecutada">Rpm de execuçaõ da operação</label>
                    <input type="number" className={`form-control`} placeholder="Qual RPM a odem de serviço deverá ser executada" value={rpmOrdemServico} onChange={(e) => setRpmOrdemServico(e.target.value)} />

                    <label className="label-form-ordem-servico" id="labelCombustivel">Combustivel</label>
                    <input type="number" className={`form-control`} placeholder="Digite o combustivel" value={combustivel} onChange={(e) => setCombustivel(e.target.value)} />

                    <label className="label-form-ordem-servico" id="labelMarchaExecucao">Marcha da execuçaõ da operação</label>
                    <input type="number" className={`form-control`} placeholder="Qual marcha a odem de serviço deverá ser executada" value={marchaOrdemServico} onChange={(e) => setMarchaOrdemServico(e.target.value)} />


                    <div className="input-button">
                        <Button
                            variant="contained"
                            size="large"
                            id="btn-cancelar-ordem-servico"
                            onClick={() => cancelarOrdemServico()}
                            startIcon={<GoArrowLeft />}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            id="btn-salvar-ordem-servico"
                            onClick={() => saveOrdemService()}
                            startIcon={<GoCheck />}
                        >
                            Salvar
                    </Button>
                    </div>
                </div>

            </div>



            <input type="hidden" value={idOrdemServico} />

        </div>

    );
}

export default OrderServicoForm;
