import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'

import './tabela.css'


const OrdemServicoTabela = () => {
    var history = useHistory();

    const [dadosOrdemServico, setDadosOrdemServico] = useState([]);

    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/ordemservico/', {}, ({ data }) => {

           
            var form = new FormData();
            setDadosOrdemServico(dados);
        })
    }, []);


    function onClickOrdemServico(id) {
        history.push(`/cadastros/ordemservico/form/${id}`);
    }

    return (
        <div className="container-ordemservico">
            {dadosOrdemServico.length && dadosOrdemServico.map((row) => (
                <div className="card-ordemservico" key={row.tal_id} onClick={() => onClickOrdemServico(row.tal_id)}>
                    <div style={{display:'flex'}}>
                        {row.hasOwnProperty('tal_imagem') && row.tal_imagem.includes('base64') ? (
                            <img className="legenda-imagem" width={100} height={100} src={row.tal_imagem} />
                        ) :
                            <img className="legenda-imagem" width={100} height={100} src={"https://adjditec.com/web/skin/img/noimage.jpg"} />
                        }</div>
                    <div className="legenda">
                        <div className="legenda-area-util">
                            {row.tal_area_util}
                        </div>
                        <div className="legenda-descricao">
                            {row.tal_descricao}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default OrdemServicoTabela;