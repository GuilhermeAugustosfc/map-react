import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';

import api from '../../services/api'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'

import DateRangePicker from "../../Componentes/DataRangerPicker/DataRangerPicker";
import moment from 'moment'
import Button from '@material-ui/core/Button';


import { store } from 'react-notifications-component';
import { HiOutlineDocumentReport, HiFilter } from 'react-icons/hi'
import { RiRoadMapLine } from 'react-icons/ri'


import { Fade } from '@material-ui/core';


import './relatorio.css';

const Tabela = () => {

    let history = useHistory();

    const [idMotorista, setIdMotorista] = useState(0);
    const [motoristas, setMotoristas] = useState([]);

    const [idVeiculo, setIdVeiculo] = useState(0);
    const [veiculos, setVeiculos] = useState([]);

    const [errorMotorista, setErrorMotorista] = useState("");
    const [errorVeiculo, setErrorVeiculo] = useState("");

    const [inicioPeriodo, setInicioPeriodo] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    const [fimPeriodo, setFimPeriodo] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));

    const [showMenu, setShowMenu] = useState(true);

    const [orderServices, setOrdemServices] = useState([{
        id: 0,
        ope_descricao: "",
        osr_motorista: "",
        osr_veiculo: "",
        tal_descricao: "",
        tempo_jornada: "",
        porc_ocioso: 0.00,
        porc_eficiencia: 0.00,
        tempo_deslocamento: "00:00:00"
    }]);

    const [macros, setMacros] = useState([{
        id: 0,
        mac_data: "",
        mac_macro: "",
    }]);



    const columnsOrderServices = [
        // {
        //     field: 'id', headerName: 'Detalhes', align: 'left', headerAlign: 'left',
        //     renderCell: (value) => {
        //         return <GoBook size={30} style={{ cursor: 'pointer', color: '#355b9a' }} onClick={() => onClickDetalhesOperacao(value.row)} />;
        //     }
        // },
        {
            field: 'id', headerName: 'Mapa', align: 'left', headerAlign: 'left',
            renderCell: (value) => {
                return <RiRoadMapLine size={30} style={{ cursor: 'pointer', color: '#355b9a' }} onClick={() => onClickMapaOperacao(value.row)} />;
            }
        },
        { field: 'ope_descricao', headerName: 'Operação', align: 'center', headerAlign: 'center' },
        { field: 'osr_motorista', headerName: 'Motorista', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'osr_veiculo', headerName: 'Veiculo', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'tal_descricao', headerName: 'Talhão', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'tempo_jornada', headerName: 'Tempo de Jornada', flex: 1, align: 'center', headerAlign: 'left',
            valueFormatter:(value) => {
                return value.value ? value.value : " - "
            }
        },
        {
            field: 'porc_ocioso', headerName: 'Ocioso %', flex: 1, align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (!value.element) return

                if (value.value > 80) {
                    value.element.style.backgroundColor = "#FF6347";
                } else if (value.value > 60) {
                    value.element.style.backgroundColor = "#FFA500";
                } else if (value.value > 40) {
                    value.element.style.backgroundColor = "#FFFF00";
                } else {
                    value.element.style.backgroundColor = "#82ff47";
                }

                value.element.style.cursor = "pointer";
                value.element.setAttribute("title", value.getValue("tempo_iniciar"));
                value.value = value.value > 0 ? `${value.value.toFixed(2)} %` : " - ";
                return value.value;
            },
        },
        {
            field: 'porc_eficiencia', headerName: 'Eficiencia %', flex: 1, align: 'center', headerAlign: 'center',
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
                value.element.setAttribute("title", value.getValue("tempo_iniciar"));
                value.value = value.value > 0 ? `${value.value.toFixed(2)} %`: " - "
                
                return value.value
            },
        },
        {
            field: 'tempo_deslocamento', headerName: 'Deslocamaento', flex: 1, align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (value.value) {
                    return value.value;
                }
                return " - "

            }
        },
    ];


    const columnsMacros = [
        {
            field: 'mac_data', headerName: 'Data da Macro', flex: 1, align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (value.value) {
                    return moment(value.value, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
                }
                return "";
            },
        },
        {
            field: 'mac_macro', headerName: 'MACRO', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (value) => {
                let classColorMacro = "relatorio-macro-aguardando-color"
                switch (value.value) {
                    case 'pausar':
                        classColorMacro = 'relatorio-macro-pausar-color'
                        break;
                    case 'iniciar':
                        classColorMacro = 'relatorio-macro-iniciar-color'
                        break;
                    case 'deslocamento':
                        classColorMacro = 'relatorio-macro-deslocamento-color'
                        break;
                    case 'finalizar':
                        classColorMacro = 'relatorio-macro-finalizar-color'
                        break;
                }
                return <div className={`relatorio-coluna-macro ${classColorMacro}`}>{value.value}</div>

            },
        },
        {
            field: 'tempo_permanencia', headerName: 'Tempo permanencia', flex: 1, align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                if (value.value) {
                    return value.value;
                }
                return "";
            },
        }
        // {
        //     field: 'total_movimento_porc', headerName: '% Eficiencia', flex: 1, type: 'number', align: 'center', headerAlign: 'left',
        //     valueFormatter: (value) => {
        //         if (!value.element) return

        //         if (value.value < 20) {
        //             value.element.style.backgroundColor = "#FF6347";
        //         } else if (value.value < 40) {
        //             value.element.style.backgroundColor = "#FFA500";
        //         } else if (value.value < 60) {
        //             value.element.style.backgroundColor = "#FFFF00";
        //         } else {
        //             value.element.style.backgroundColor = "#82ff47";
        //         }

        //         value.element.style.cursor = "pointer";
        //         value.element.setAttribute("title", value.getValue("total_movimento"));

        //         return `${value.value} %`
        //     },
        //     valueGetter: (params) => parseInt(params.value) || 0
        // },
    ];

    function onChangeData(ev, picker) {
        setInicioPeriodo(picker.startDate.format('DD/MM/YYYY HH:mm:ss'))
        setFimPeriodo(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
    }

    function onClickDetalhesOperacao(rowDataGrid) {
        if (!rowDataGrid.id || !rowDataGrid.hasOwnProperty('macros')) return
        console.log(rowDataGrid);
    }

    function onClickMapaOperacao(operacao) {
        operacao.data_init = moment(operacao.osr_periodo_ini, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
        operacao.data_fim = moment(operacao.osr_periodo_fim, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");

        delete operacao.osr_periodo_fim;
        delete operacao.osr_periodo_ini;

        history.push(`/mapa/${operacao.osr_id_veiculo}`, operacao);
    }

    // function onClickDetalhesToMap(rowDataGrid) {
    //     rowDataGrid.data_init = rowDataGrid.data_f;
    //     rowDataGrid.data_fim = rowDataGrid.data_f;
    //     delete rowDataGrid.data_f;
    //     history.push(`/mapa/${rowDataGrid.id_veiculo}`, rowDataGrid)
    // }

    function validarDados() {
        var valid = true;

        if (!idMotorista && !idVeiculo) {
            valid = false;
            setErrorMotorista('error-border');
            setErrorVeiculo('error-border');
        }

        return valid;
    }

    function clearFilterError() {
        setErrorMotorista("");
        setErrorVeiculo("");
    }

    function gerarRelatorio() {
        clearFilterError()
        if (validarDados()) {

            var form = new FormData();

            form.append('id_motorista', idMotorista)
            form.append('id_veiculo', idVeiculo)
            form.append('data_ini', moment(inicioPeriodo, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'))
            form.append('data_fim', moment(fimPeriodo, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'))

            api.post('/ordemservico/generateReport', form, (res) => {
                if (res.status) {
                    setOrdemServices(res.data.data);
                    setShowMenu(false);
                } else {
                    store.addNotification({
                        title: "Erro ao gerar o Relatorio!",
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
    }

    function changeMenu() {
        let show = !showMenu;
        setShowMenu(show);
    }

    useEffect(() => {

        api.get(`/motorista`, {}, ({ data }) => {
            setMotoristas(data.data);
        });

        api.get(`/veiculo`, {}, ({ data }) => {
            setVeiculos(data.data);
        });

    }, []);

    return (
        <div className="container-relatorio">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-lg-12">
                        <h2>
                            <b>Relatório de Ordem de Serviço</b>
                        </h2>
                    </div>
                </div>
                <Fade in={showMenu}>
                    <div className="relatorio-filtro-container">
                        <div className="relatorio-filtro-heading">
                            <HiFilter onClick={changeMenu} style={{ cursor: 'pointer', marginRight: '7px', fontSize: '24px' }} /> Filtros
                        </div>
                        <div className="relatorio-filtro-body">
                            <div>
                                <label className="label-periodo-ordemservico">Periodo</label>
                                <DateRangePicker
                                    onChangeData={onChangeData}
                                    startDate={inicioPeriodo}
                                    endDate={fimPeriodo}
                                />
                            </div>
                            <div>
                                <label className="label-form-ordem-servico" id="labelMotorista">Motorista</label>
                                <select
                                    htmlFor="labelMotorista"
                                    id="selectMotorista"
                                    className={`select-form ${errorMotorista}`}
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
                            <div>
                                <label className="label-form-ordem-servico" id="labelVeiculos">Veiculos</label>
                                <select
                                    htmlFor="labelVeiculos"
                                    id="selectVeiculos"
                                    className={`select-form ${errorVeiculo}`}
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

                </Fade>
                <div className="row">
                    <div className="col-lg-12">
                        <h4>
                            <b>Local:</b>
                            Faz. Santa Cecília
                            <HiFilter onClick={changeMenu} className="btn-relatorio-filtro" />
                        </h4>
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
                <div className="col-md-12">
                    <DataGrid key="dataGrid1" className="DataGrid" rows={orderServices} columns={columnsOrderServices} />
                </div>
                {/* <div className="col-md-4">
                <DataGrid key="dataGrid2" className="DataGrid" rows={macros} columns={columnsMacros} />
            </div> */}
            </div>

        </div>
    );
};

export default Tabela;
