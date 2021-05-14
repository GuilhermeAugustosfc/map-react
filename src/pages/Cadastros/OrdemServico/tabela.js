import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoPlay, GoPlus, GoChecklist, GoClock } from 'react-icons/go'

import { AiFillEdit } from 'react-icons/ai';


import './tabela.css'
import moment from "moment";


const OrdemServicoTabela = () => {
    var history = useHistory();

    const [dadosOrdemServico, setDadosOrdemServico] = useState([]);

    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/ordemservico/', {}, ({ data }) => {
            setDadosOrdemServico(data);
        })
    }, []);

    function addOrdemServico() {
        history.push(`/cadastros/ordemservico/form`);
    }

    function statusOperacao(operacao) {
        
        if (operacao.status === "agendado") {
            return <div className="status-ordem-servico" onClick={() => clickOrdemServico('editar', operacao)} style={{background:'#ffa5009e'}}>Agendado</div>;
        } else if (operacao.status === "andamento") {
            return <div style={{display:'flex',marginTop:'18px', justifyContent:'center', alignItems:'center'}}>
                        <div className="status-ordem-servico" onClick={() => clickOrdemServico('mapa', operacao)} style={{background:'#00fa005e', flex:5, marginTop:0, marginRight:'3px'}}>Em Andamento</div>
                        <AiFillEdit style={{flex:1, fontSize:'30px', borderRadius:'4px',backgroundColor:'#ffa5004d', cursor:'pointer'}} onClick={() => clickOrdemServico('editar', operacao)} />
                    </div>
        } else {
            return <div className="status-ordem-servico" onClick={() => clickOrdemServico('mapa', operacao)} style={{background:'#8080803b'}}>Finalizada</div>;
        }

    }

    function statusIconeOperacao({ status }) {
        if (status === "agendado") {
            return <GoClock size={30} color={'rgba(255, 165, 0)'} />
        } else if (status === "andamento") {
            return <GoPlay size={30} color={'#13f417'} />
        } else {
            return <GoChecklist size={30} color={'#ececec'} />
        }
    }


    function clickOrdemServico(acao, operacao) {
        if (acao === "editar") {
        history.push(`/cadastros/ordemservico/form/${operacao.osr_id}`);
           
        } else if (acao === "mapa") {
            operacao.data_init = moment(operacao.osr_periodo_ini , "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:ss:mm");
            operacao.data_fim = moment(operacao.osr_periodo_fim , "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:ss:mm");
            
            delete operacao.osr_periodo_ini;
            delete operacao.osr_periodo_fim;
            history.push(`/mapa/${operacao.osr_id_veiculo}`, operacao);
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
            {dadosOrdemServico && dadosOrdemServico.length && dadosOrdemServico.map((row) => (
                <div className="card-ordemservico" key={row.osr_id}>
                    <div style={{ display: 'flex' }}>
                        {row.tal_imagem ? (
                            <img className="image-talhao-order-servico" alt="imagem-talhao" width={100} height={100} src={row.tal_imagem} />
                        ) :
                            <img className="image-talhao-order-servico" alt="imagem-talhao" width={100} height={100} src={"https://adjditec.com/web/skin/img/noimage.jpg"} />
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
                        {statusOperacao(row)}
                    </div>
                </div>
            ))}
        </div>
    );

}

export default OrdemServicoTabela;