import React, { useState, useEffect } from "react";

import api from '../../services/api'

import mqtt from 'mqtt'
import { store } from 'react-notifications-component';

import './PainelOs.css';
import moment from "moment";


var client = mqtt.connect(process.env.REACT_APP_MQTT_HOSTNAME, {
    username: process.env.REACT_APP_MQTT_USERNAME,
    port:process.env.REACT_APP_MQTT_PORT,
    password: process.env.REACT_APP_MQTT_PASSWORD,
    protocol: 'ws',
    connectTimeout: 4000, // Timeout period
    clientId: 1,
})


const PainelOs = () => {

    const [dadosPainelOs, setDadosPainelOs] = useState([]);

    function templateMacro(macro) {
        return (
            <div>
                <div><strong>Motorista: </strong>{macro.mac_motorista}</div>
                <div><strong>Ação: </strong>{macro.mac_macro}</div>
            </div>
        )
    }

    function statusOSTabela(status) {
        switch (status) {
            case 'deslocamento':
                return <div className="tabela-painel-os-coluna-status-deslocamento">DESLOCAMENTO</div>
            case 'iniciar':
                return <div className="tabela-painel-os-coluna-status-iniciar">INICIOU</div>
            case 'finalizar':
                return <div className="tabela-painel-os-coluna-status-finalizar">FINALIZADO</div>
            case 'pausar':
                return <div className="tabela-painel-os-coluna-status-pausar">PAUSADO</div>
            case 'aguardando':
                return <div className="tabela-painel-os-coluna-status-aguardando">{status}</div>
            default:
                return <div className="tabela-painel-os-coluna-status-aguardando">{status}</div>
            }
        
    }

    function atualizarPainelOs (macro) {
        setDadosPainelOs((state) => {
            var newArr = [...state];
            let indexOs = newArr.findIndex((row, index) => { 
                if (row.osr_id === macro.mac_id_operacao ) {
                    return index;
                }
            })

            newArr[indexOs].status = macro.mac_macro;
            return newArr;
        });

        store.addNotification({
            title: "Ação do motorista!",
            message: templateMacro(macro),
            type: "info",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 15000,
                onScreen: true
            }
        });
    }

    useEffect(() => {
        
        api.get('http://f-agro-api.fulltrackapp.com/ordemservico/painelOs', {}, ({ data }) => {
            setDadosPainelOs(data);

            if (!client.connected) {
                client.on('connect', function () {
                    console.log('conecotu mqtt');
                    client.subscribe('macro');
                })
            
                client.on('message', function (topic, message) {
                    // message is Buffer
                    message = message.toString();
                    var macro = {};
                    try {
                        macro = JSON.parse(message)
                    } catch (error) {
                        console.log(error);
                        return
                    }
    
                    atualizarPainelOs(macro);
                })
            } 
        })
    }, []);

    

    return (
        <div className="container-painel-os">
            <div className="painel-os-title">
                <p>ORDENS DE SERVIÇOS DE HOJE</p>
                <div>{moment().format("DD/MM/YYYY")}</div>
            </div>
            <div className="container-tabela-os">
                <table className="tabela-painel-os table table-dark table-stripped">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Operação</th>
                            <th>Motorista</th>
                            <th>Veiculo</th>
                            <th>Implemento</th>
                            <th>Talhão</th>
                            <th>Cultura</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {dadosPainelOs && dadosPainelOs.length > 0 && dadosPainelOs.map((operacao, i) => (
                            <tr key={i}>
                                <td className="paienl-os-coluna">{operacao.osr_codigo}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-operacao">{operacao.ope_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-motorista">{operacao.osr_motorista}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-veiculo">{operacao.osr_veiculo}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-implemento">{operacao.imp_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-talhao">{operacao.tal_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-cultura">{operacao.cul_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-status">{operacao.hasOwnProperty('status') ? statusOSTabela(operacao.status) : statusOSTabela('aguardando') }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PainelOs;
