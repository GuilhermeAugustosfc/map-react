import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'


import './tabela.css'

const TalhaoTabela = () => {

    const [dadosTalhao, setDadosTalhao] = useState([]);

    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/talhao/', {}, ({ data }) => {

            var idsTalhao = [];
            var dados = [];
            for (var i in data) {
                data[i].id = i;
                dados[data[i].tal_id] = data[i];
                idsTalhao.push(data[i].tal_id);
            }

            var form = new FormData();
            form.append('tal_id', JSON.stringify(idsTalhao));
            api.post('http://[::1]/f_agro_api/talhao/imagem/', form, ({ data }) => {

                for (var i in data) {
                    dados[data[i].tal_id].tal_imagem = data[i].tal_imagem
                }

                setDadosTalhao(dados);
            })

        })


    }, []);


    return (
        <div className="container-talhao">
            {dadosTalhao.length && dadosTalhao.map((row) => (
                <div className="card-talhao" key={row.tal_id}>
                    <div >
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

export default TalhaoTabela;