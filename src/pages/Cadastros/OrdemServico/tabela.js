import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoTrashcan, GoPlus, GoClippy } from 'react-icons/go'


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

    function editarOderServico(id) {
        history.push(`/cadastros/ordemservico/form/${id}`);
    }

    function acompanharOrdemServico(id) {
        history.push(`/mapa/${id}`, dadosOrdemServico);
    }

    function detalhesOrdemServico(id) {
        console.log('detalhes');
    }

    function calcStatusOperacao(dt_init, dt_fim, id_veiculo, id_operacao) {
        var dt_atual = new Date().toLocaleDateString();

        var segundosAtual = moment(dt_atual, "DD/MM/YYYY").unix();
        var dt_init_secs = moment(dt_init, "YYYY-MM-DD").unix();
        var dt_fim_secs = moment(dt_fim, "YYYY-MM-DD").unix();

        if (parseInt(segundosAtual) < parseInt(dt_init_secs)) {
            return <div className="status-ordem-servico" onClick={() => editarOderServico(id_operacao)} style={{background:'#ffa5009e'}}>Agendado</div>;
        } else if (parseInt(segundosAtual) >= parseInt(dt_init_secs) && parseInt(segundosAtual) <= parseInt(dt_fim_secs)) {
            return <div className="status-ordem-servico" onClick={() => acompanharOrdemServico(id_veiculo)} style={{background:'#00fa005e'}}>Em Andamento</div>;
        } else {
            return <div className="status-ordem-servico" onClick={() => detalhesOrdemServico(id_veiculo)} style={{background:'#8080803b'}}>Finalizada</div>;
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
                <div className="card-ordemservico" key={row.osr_id}>
                    <div>

                    </div>
                    <div style={{ display: 'flex' }}>
                        {row.tal_imagem ? (
                            <img className="image-talhao-order-servico" width={100} height={100} src={row.tal_imagem} />
                        ) :
                            <img className="image-talhao-order-servico" width={100} height={100} src={"https://adjditec.com/web/skin/img/noimage.jpg"} />
                        }</div>
                    <div className="legenda">
                        <div className="legenda-area-util">
                            {row.tal_descricao}
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
                            <strong>Periodo: </strong>{moment(row.osr_periodo_ini, 'YYYY-MM-DD').format("DD/MM/YYYY")} - {moment(row.osr_periodo_fim, 'YYYY-MM-DD').format("DD/MM/YYYY")}
                        </div>
                        <div className="status-operacao">
                            {calcStatusOperacao(
                                row.osr_periodo_ini,
                                row.osr_periodo_fim,
                                row.osr_id_veiculo,
                                row.osr_id,
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default OrdemServicoTabela;