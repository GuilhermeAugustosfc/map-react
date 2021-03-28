import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';

import axios from 'axios'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'

import './tabela.css';

const Tabela = () => {

    let history = useHistory();

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
        {field:'id', headerName: 'Action', align: 'left', headerAlign: 'left', 
            renderCell:(value) => {
                return <GoBook size={30} style={{cursor:'pointer', color:'#355b9a'}} onClick={() => onClickDetalhesDataGrid(value.row)}/>;
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
        {field:'id', headerName: 'Action', align: 'left', headerAlign: 'left', 
            renderCell:(value) => {
                return <GoBook size={30} style={{cursor:'pointer', color:'#355b9a'}} onClick={() => onClickDetalhesToMap(value.row)}/>;
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

    useEffect(() => {
        axios({
            method: "get",
            url: "http://f-agro-api.fulltrackapp.com/eficiencia?data_ini=2021-03-01&data_fim=2021-03-20",
            headers: { "Authorization": "Bearer 08deaf2eacf29799dd6dbfb0b74f506e12f3125f" },
        })
        .then(function (response) {
            let { data } = response.data;

            data = data.map((row, index) => {
                return { ...row, ...{ id: index } }
            })
            setConsolidadoGeral(data);

        })
        .catch(function (response) {
            console.log(response);
        });


        axios({
            method: "get",
            url: "http://f-agro-api.fulltrackapp.com/eficiencia/detalhe?data_ini=2021-03-01&data_fim=2021-03-30&vei_id=47407",
            headers: { "Authorization": "Bearer 08deaf2eacf29799dd6dbfb0b74f506e12f3125f" },
        })
        .then(function (response) {
            let { data } = response.data;

            data = data.map((row, index) => {
                return { ...row, ...{ id: index } }
            })
            console.log(data);
            setConsolidadoDetalhes(data);

        })
        .catch(function (response) {
            console.log(response);
        });

    }, []);

    function onClickDetalhesDataGrid(rowDataGrid) {
        console.log(rowDataGrid);
    }

    
    function onClickDetalhesToMap(rowDataGrid) {
        history.push(`/mapa/${rowDataGrid.id_veiculo}`, rowDataGrid)
    }




    return (
        <div className="ContainerDatagrid">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-lg-12">
                        <h2><b>Produtividade por veículo</b></h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <h4><b>Local:</b> Faz. Santa Cecília</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <h4>TOTAL DO PERÍODO SELECIONADO</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <h4>Período de <b>01/03/2021</b> até <b>31/03/2021</b></h4>
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
            <DataGrid key="dataGrid1" className="DataGrid" rows={consolidadoGeral} columns={columnsConsolidadoGeral} />

            <DataGrid key="dataGrid2" className="DataGrid" rows={consolidadoDetalhes} columns={columnsConsolidadoDetalhes} />
        </div>
    );
};

export default Tabela;
