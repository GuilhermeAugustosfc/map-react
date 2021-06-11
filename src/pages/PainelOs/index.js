import React, { useState, useEffect, useContext } from "react";

import api from '../../services/api'

import './PainelOs.css';
import moment from "moment";

import { Howl } from 'howler';

import alertMp3 from '../../media/audio3.mp3';

import mqttContext from '../../Contexts/mqtt'


function PainelOs() {
    
    var mqttConnection = useContext(mqttContext);
    const [dadosPainelOs, setDadosPainelOs] = useState([]);

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

    function messageMqtt(macro) {
        setDadosPainelOs((data) => {
            var newArr = [...data];
            let indexOs = 0;

            for (var i in newArr) {
                if (parseInt(newArr[i].osr_id, 10) === parseInt(macro.mac_id_operacao) ) {
                    indexOs = i;
                }
            }

            newArr[indexOs].status = macro.mac_macro;

            return newArr;
        })
      
        var sound = new Howl({
            src: [alertMp3]
        });
          
        sound.play();
    }

    useEffect(() => {

        var instanciaMqtt = mqttConnection.instaceMqtt.current;
        instanciaMqtt.setFuctionMessageMqtt(messageMqtt);

        api.get('/ordemservico/painelOs', {}, ({ data }) => {
            setDadosPainelOs(data);
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
                                <td className="paienl-os-coluna tabela-painel-os-coluna-status">{operacao.hasOwnProperty('status') ? statusOSTabela(operacao.status) : statusOSTabela('aguardando')}
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
