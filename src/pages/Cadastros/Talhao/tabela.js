import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoTrashcan, GoPlus } from 'react-icons/go'


import './tabela.css'


const TalhaoTabela = () => {
    var history = useHistory();

    const [dadosTalhao, setDadosTalhao] = useState([]);

    useEffect(() => {
        getDados();
    }, []);

    function getDados() {
        api.get('http://f-agro-api.fulltrackapp.com/talhao/', {}, ({ data }) => {
            setDadosTalhao(data);
        })
    }


    function onClickEditarTalhao(id) {
        history.push(`/cadastros/talhao/form/${id}`);
    }

    function onClickNovoTalhao() {
        history.push(`/cadastros/talhao/form/`);

    }

    function deleteTalhao(id) {
        api.delete(`http://f-agro-api.fulltrackapp.com/talhao/${id}`, {}, ({ data }) => {
            getDados();
        })
    }

    return (
        <div className="container-talhao">
            <div className="card-talhao card-novo-talhao" onClick={() => onClickNovoTalhao()}>
                <GoPlus size={150} />
                <div className="legenda-talhao">
                    <div className="legenda-talhao-descricao">
                        Novo Talhão
                    </div>
                </div>
            </div>
            {dadosTalhao.length && dadosTalhao.map((row) => (
                <div className="card-talhao" key={row.tal_id} >
                    <div style={{ display: 'flex' }} onClick={() => onClickEditarTalhao(row.tal_id)} >
                        {row.tal_imagem ? (
                            <img className="legenda-imagem" alt="imagem-talhao" width={100} height={100} src={row.tal_imagem} />
                        ) :
                            <img className="legenda-imagem" alt="imagem-talhao" width={100} height={100} src={"https://adjditec.com/web/skin/img/noimage.jpg"} />
                        }</div>
                    <div className="legenda-talhao">
                        <span className="legenda-talhao-descricao">
                            {row.tal_descricao}
                        </span>
                        <div className="legenda-area-util">
                            {row.tal_area_util}
                        </div>
                        <div className="button-talhao" style={{ float: "right" }}>
                            <GoTrashcan color={'#900000'} onClick={() => deleteTalhao(row.tal_id)} size={23} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TalhaoTabela;