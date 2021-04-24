import React, { useState, useEffect } from "react";
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoTrashcan, GoPlus } from 'react-icons/go'

import Swal from 'sweetalert2'

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

    function deleteTalhao(id, url_s3_image) {
        Swal.fire({
            title: 'Você tem certeza ?',
            text: 'Você tem certeza que deseja deletar esse Talhão ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, eu quero!',
            cancelButtonText: 'Não, me enganei!'
        }).then((result) => {
            if (result.value) {
                let form = new FormData();
                form.append('id', id);

                if (url_s3_image && url_s3_image.split('talhao/').length > 0) {
                    form.append('filename', url_s3_image.split('talhao/')[1])
                }

                api.post(`http://f-agro-api.fulltrackapp.com/talhao/delete`, form, ({ data }) => {
                    Swal.fire(
                        'Deletado !',
                        'O talhão foi deletado com sucesso.',
                        'success'
                    )
                    getDados();
                })

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Operação cancelada',
                    'Você não deletou seu talhão!',
                    'error'
                )
            }
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
            {dadosTalhao.length > 0 && dadosTalhao.map((row) => (
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
                        <div className="button-delete-talhao">
                            <GoTrashcan color={'#900000bf'} onClick={() => deleteTalhao(row.tal_id, row.tal_imagem)} size={23} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TalhaoTabela;