import React, { useState, useEffect } from "react";

import api from '../../services/api'

import { GoBook } from 'react-icons/go'

import './PainelOs.css';

const PainelOs = () => {

    const [dadosPainelOs, setDadosPainelOs] = useState([]);
    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/ordemservico/painelOs', {}, ({ data }) => {
            setDadosPainelOs(data);
        })

    }, []);

    return (
        <div className="container-painel-os">
            <div className="painel-os-title">
                <p>ORDENS DE SERVIÇOS DE HOJE</p>
                <div>17/04/2021</div>
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
                        {dadosPainelOs.length > 0 && dadosPainelOs.map((operacao, i) => (
                            <tr key={i}>
                                <td className="paienl-os-coluna">{operacao.osr_codigo}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-operacao">{operacao.ope_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-motorista">{operacao.osr_motorista}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-veiculo">{operacao.osr_veiculo}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-implemento">{operacao.imp_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-talhao">{operacao.tal_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-cultura">{operacao.cul_descricao}</td>
                                <td className="paienl-os-coluna tabela-painel-os-coluna-status">Aguardando</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PainelOs;
