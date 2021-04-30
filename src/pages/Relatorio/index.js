import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';

import api from '../../services/api'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'

import DateRangePicker from "../../Componentes/DataRangerPicker/DataRangerPicker";
import moment from 'moment'
import Button from '@material-ui/core/Button';

import { HiOutlineDocumentReport, HiFilter } from 'react-icons/hi'


import './relatorio.css';

const Tabela = () => {

    let history = useHistory();

    const [idMotorista, setIdMotorista] = useState(0);
    const [motoristas, setMotoristas] = useState([]);

    const [idVeiculo, setIdVeiculo] = useState(0);
    const [veiculos, setVeiculos] = useState([]);

    const [inicioPeriodo, setInicioPeriodo] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    const [fimPeriodo, setFimPeriodo] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));


    const [consolidadoGeral, setConsolidadoGeral] = useState([{
        id: 0,
        ras_vei_tipo: "",
        veiculo: "",
        total_jornada_seg: 0,
        total_ocioso_porc: 0,
        total_movimento_porc: 0,
        velocidade_media: 0,
        odometro: 0
    }]);

    const [consolidadoDetalhes, setConsolidadoDetalhes] = useState([{
        id: 0,
        ras_vei_tipo: "",
        veiculo: "",
        total_jornada_seg: 0,
        total_ocioso_porc: 0,
        total_movimento_porc: 0,
        velocidade_media: 0,
        odometro: 0
    }]);



    const columnsConsolidadoGeral = [
        {
            field: 'id', headerName: 'Action', align: 'left', headerAlign: 'left',
            renderCell: (value) => {
                return <GoBook size={30} style={{ cursor: 'pointer', color: '#355b9a' }} onClick={() => onClickDetalhesDataGrid(value.row)} />;
            }
        },
        { field: 'ras_vei_tipo', headerName: 'Tipo', align: 'center', headerAlign: 'center' },
        { field: 'veiculo', headerName: 'Veiculo', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'total_jornada_seg', headerName: 'Tempo da Jornada', type: 'number', flex: 1, align: 'center', headerAlign: 'left',
            valueFormatter: (value) => value.row.total_jornada
        },
        {
            field: 'total_ocioso_porc', headerName: '% Ocioso', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value > 60) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value > 40) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value > 20) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("total_movimento"));

                return `${value.value} %`;

            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'total_movimento_porc', headerName: '% Eficiencia', flex: 1, type: 'number', align: 'center', headerAlign: 'left',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value < 20) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value < 40) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value < 60) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("total_movimento"));

                return `${value.value} %`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'velocidade_media', headerName: 'Velocidade Media', flex: 1, type: 'number', align: 'center', headerAlign: 'left',
            valueFormatter: (value) => {
                return `${value.value} Km/h`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'odometro', headerName: 'Odometro', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                return `${value.value} Km/h`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
    ];


    const columnsConsolidadoDetalhes = [
        {
            field: 'id', headerName: 'Action', align: 'left', headerAlign: 'left',
            renderCell: (value) => {
                return <GoBook size={30} style={{ cursor: 'pointer', color: '#355b9a' }} onClick={() => onClickDetalhesToMap(value.row)} />;
            }
        },
        { field: 'data_f', headerName: 'Data', align: 'center', headerAlign: 'center' },
        { field: 'veiculo', headerName: 'Veiculo', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'total_jornada_seg', headerName: 'Tempo da Jornada', type: 'number', flex: 1, align: 'center', headerAlign: 'left',
            valueFormatter: (value) => value.row.total_jornada
        },
        {
            field: 'total_ocioso_porc', headerName: '% Ocioso', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value > 60) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value > 40) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value > 20) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("total_movimento"));

                return `${value.value} %`;

            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'total_movimento_porc', headerName: '% Eficiencia', flex: 1, type: 'number', align: 'center', headerAlign: 'left',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value < 20) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value < 40) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value < 60) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("total_movimento"));

                return `${value.value} %`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'total_improdutivo_porc', headerName: '% Improdutivo', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value > 60) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value > 40) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value > 20) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("total_improdutivo"));

                return `${value.value} %`;

            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'velocidade_media', headerName: 'Velocidade Media', flex: 1, type: 'number', align: 'center', headerAlign: 'left',
            valueFormatter: (value) => {
                return `${value.value} Km/h`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
        {
            field: 'odometro', headerName: 'Odometro', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                return `${value.value} Km/h`
            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
    ];

    function onChangeData(ev, picker) {
        setInicioPeriodo(picker.startDate.format('DD/MM/YYYY HH:mm:ss'))
        setFimPeriodo(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
    }

    useEffect(() => {

        api.get(`http://f-agro-api.fulltrackapp.com/motorista`, {}, ({ data }) => {
            setMotoristas(data.data);
        });

        api.get(`http://f-agro-api.fulltrackapp.com/veiculo`, {}, ({ data }) => {
            setVeiculos(data.data);
        });

        api.get('http://f-agro-api.fulltrackapp.com/eficiencia?data_ini=2021-03-01&data_fim=2021-03-20', {}, ({ data }) => {

            data = data.map((row, index) => {
                return { ...row, ...{ id: index } }
            })
            setConsolidadoGeral(data);
        })

        api.get('http://f-agro-api.fulltrackapp.com/eficiencia/detalhe?data_ini=2021-03-01&data_fim=2021-03-30&vei_id=47407', {}, ({ data }) => {

            data = data.map((row, index) => {
                return { ...row, ...{ id: index } }
            })

            setConsolidadoDetalhes(data);
        })

    }, []);

    function onClickDetalhesDataGrid(rowDataGrid) {
        console.log(rowDataGrid);
    }


    function onClickDetalhesToMap(rowDataGrid) {
        rowDataGrid.data_init = rowDataGrid.data_f;
        rowDataGrid.data_fim = rowDataGrid.data_f;
        delete rowDataGrid.data_f;
        history.push(`/mapa/${rowDataGrid.id_veiculo}`, rowDataGrid)
    }

    function gerarRelatorio() {
        var data = {
            id_motorista: idMotorista,
            id_veiculo: idVeiculo,
            dt_inicio: inicioPeriodo,
            dt_fim: fimPeriodo
        }

        
    }

    function changeMenu() {
        
    }


    return (
        <div className="container-relatorio">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-lg-12">
                        <h2><b>Realatorio de Ordem de Serviço</b></h2>
                    </div>
                </div>
                <div className="relatorio-filtro-container">
                    <div className="relatorio-filtro-heading">
                        <HiFilter onClick={changeMenu} cursor="pointer" /> Filtros
                    </div>
                    <div className="relatorio-filtro-body">
                        <div>
                            <label className="label-periodo-ordemservico">Periodo</label>
                            <DateRangePicker
                                onChangeData={onChangeData}
                                initialSetings={{
                                    startDate: inicioPeriodo,
                                    endDate: fimPeriodo,
                                    timePicker: true,
                                    // timePicker24Hour: true,
                                    linkedCalendars: false,
                                    // timePickerSeconds: true,
                                    autoApply: true,
                                    locale: {
                                        format: 'DD/MM/YYYY HH:mm:ss',
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label className="label-form-ordem-servico" id="labelMotorista">Motorista</label>
                            <select
                                htmlFor="labelMotorista"
                                id="selectMotorista"
                                className={`select-form`}
                                value={idMotorista}
                                onChange={(e) => setIdMotorista(e.target.value)}
                            >
                                <option
                                    key="0"
                                    value=""
                                >
                                    Nenhum Selecionado
                                </option>
                                {motoristas.length && motoristas.map((mot) => (
                                    <option
                                        key={mot.ras_mot_id}
                                        value={mot.ras_mot_id}>
                                        {mot.ras_mot_nome}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div>
                            <label className="label-form-ordem-servico" id="labelVeiculos">Veiculos</label>
                            <select
                                htmlFor="labelVeiculos"
                                id="selectVeiculos"
                                className={`select-form`}
                                value={idVeiculo}
                                onChange={(e) => setIdVeiculo(e.target.value)}
                            >
                                <option
                                    key="0"
                                    value=""
                                >
                                    Nenhum Selecionado
                                </option>
                                {veiculos.length && veiculos.map((vei) => (
                                    <option
                                        key={vei.ras_vei_id}
                                        value={vei.ras_vei_id}>
                                        {vei.ras_vei_veiculo}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                size="medium"
                                id="btn-gerar-relatorio"
                                onClick={() => gerarRelatorio()}
                                startIcon={<HiOutlineDocumentReport />}
                            >
                                Gerar
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <h4><b>Local:</b> Faz. Santa Cecília</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <h4>Período de <b>{inicioPeriodo}</b> até <b>{fimPeriodo}</b></h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>Total Jornada:</b> Soma (período total) do intervalo entre a primeira e a última ignição do dia .</small>
                    </div>
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>% Ocioso:</b> Soma (período total) do tempo com a <i><b>ignição ligada</b></i> e parado <i><b>dividido</b></i> pelo <i><b>Total Jornada</b></i></small>
                    </div>
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>% Eficiência:</b> Soma (período total) do tempo com a <i><b>ignição ligada</b></i> em movimento <i><b>dividido</b></i> pelo <i><b>Total Jornada</b></i></small>
                    </div>
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>Odômetro:</b> Soma da odômetro percorrido no período total.</small>
                    </div>
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>Faixa % Ocioso:</b> 20-39 = amarelo | 40-59 = laranja | &gt;60 = vermelho </small>
                    </div>
                    <div className="col-lg-2">
                        <small className="form-text text-muted"><i className="fa fa-info-circle"></i> <b>Faixa % Eficiência:</b> 40-59 = amarelo | 20-39 = laranja | &lt;20 = vermelho </small>
                    </div>
                </div>
            </div>
            <div className="row container-tabelas">
                <div className="col-md-6">
                    <DataGrid key="dataGrid1" className="DataGrid" rows={consolidadoGeral} columns={columnsConsolidadoGeral} />
                </div>
                <div className="col-md-6">
                    <DataGrid key="dataGrid2" className="DataGrid" rows={consolidadoDetalhes} columns={columnsConsolidadoDetalhes} />
                </div>
            </div>

        </div>
    );
};

export default Tabela;
