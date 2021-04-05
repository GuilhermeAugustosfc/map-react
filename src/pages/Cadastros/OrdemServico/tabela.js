import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoPlay, GoPlus, GoTasklist, GoClock } from 'react-icons/go'


import './tabela.css'
import moment from "moment";


const OrdemServicoTabela = () => {
    var history = useHistory();

    const [dadosOrdemServico, setDadosOrdemServico] = useState([]);

    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/ordemservico/', {}, ({ data }) => {
            var form = new FormData();
            setDadosOrdemServico(data);
        })
    }, []);

    function addOrdemServico() {
        history.push(`/cadastros/ordemservico/form`);
    }

    function statusOperacao(operacao) {
        
        if (operacao.status === "agendado") {
            return <div className="status-ordem-servico" style={{background:'#ffa5009e'}}>Agendado</div>;
        } else if (operacao.status === "andamento") {
            return <div className="status-ordem-servico" style={{background:'#00fa005e'}}>Em Andamento</div>;
        } else {
            return <div className="status-ordem-servico" style={{background:'#8080803b'}}>Finalizada</div>;
        }

    }

    function statusIconeOperacao({ status }) {
        if (status === "agendado") {
            return <GoClock size={30} color={'rgba(255, 165, 0)'} />
        } else if (status === "andamento") {
            return <GoPlay size={30} color={'#13f417'} />
        } else {
            return <GoTasklist size={30} color={'#d8d8d8'} />
        }
    }


    function clickOrdemServico(operacao) {
        if (operacao.status === "agendado") {
        history.push(`/cadastros/ordemservico/form/${operacao.osr_id}`);
           
        } else if (operacao.status === "andamento") {
            operacao.data_init = moment(operacao.osr_periodo_ini , "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:ss:mm");
            operacao.data_fim = moment(operacao.osr_periodo_fim , "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:ss:mm");
    
            delete operacao.osr_periodo_ini;
            delete operacao.osr_periodo_fim;
            history.push(`/mapa/${operacao.osr_id_veiculo}`, operacao);
        } else {
        console.log('detalhes');
            
        }
    }

    return (
        <div className="container-ordemservico">
            <div className="card-ordemservico card-novo-ordemservico" onClick={() => addOrdemServico()}>
                <GoPlus size={150} />
                <div className="legenda">
                    <div className="legenda-descricao">
                        Nova Ordem Serviço
                    </div>
                </div>
            </div>
            {dadosOrdemServico.length && dadosOrdemServico.map((row) => (
                <div className="card-ordemservico" key={row.osr_id} onClick={() => clickOrdemServico(row)}>
                    <div style={{ display: 'flex' }}>
                        {row.tal_imagem ? (
                            <img className="image-talhao-order-servico" width={100} height={100} src={row.tal_imagem} />
                        ) :
                            <img className="image-talhao-order-servico" width={100} height={100} src={"https://adjditec.com/web/skin/img/noimage.jpg"} />
                        }</div>
                    <div className="legenda">
                        <div className="legenda-talhao-order-servico">
                            {row.tal_descricao}
                        </div>
                        <div className="legenda-status-order-servico">
                            {statusIconeOperacao(row)}

                        </div>
                        <div>
                            <strong>Operação: </strong>{row.ope_descricao}
                        </div>
                        <div>
                            <strong>Cultura: </strong>{row.cul_descricao}
                        </div>
                        <div>
                            <strong>Veiculo: </strong>{row.osr_veiculo}
                        </div>
                        <div>
                            <strong>Motorista: </strong>{row.osr_motorista}
                        </div>
                        <div>
                            <strong>Periodo: </strong>{moment(row.osr_periodo_ini, 'YYYY-MM-DD HH:mm:ss').format("DD/MM/YYYY HH:mm:ss")} - {moment(row.osr_periodo_fim, 'YYYY-MM-DD HH:mm:ss').format("DD/MM/YYYY HH:mm:ss")}
                        </div>
                        <div className="status-operacao">
                            {statusOperacao(row)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default OrdemServicoTabela;