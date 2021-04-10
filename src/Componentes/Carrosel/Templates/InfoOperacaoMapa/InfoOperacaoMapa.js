import React from 'react';
import './InfoOperacaoMapa.css'
import { AiFillCar } from "react-icons/ai";
import { IoIosSpeedometer } from "react-icons/io";
import { GiFarmer, GiFarmTractor, GiFireTail } from "react-icons/gi";



const InfoOperacaoMapa = function ({ operacao }) {

    return <div id="painel-operacao">
        <div className="operacao">
            {operacao.ope_descricao}
        </div>
        <div className="bloco-operacao">
            <div className="info-operacao">
                <strong>Cultura: </strong> {operacao.cul_descricao}
            </div>
            <div className="info-operacao">
                <strong>Veiculo: </strong> {operacao.osr_veiculo}
            </div>
            <div className="info-operacao">
                <strong>Velocidade: </strong> {operacao.osr_velocidade}
            </div>
            <div className="info-operacao">
                <strong>Motorista: </strong> {operacao.osr_motorista}
            </div>
            <div className="info-operacao">
                <strong>Implemento: </strong> {operacao.imp_descricao}
            </div>
            <div className="info-operacao">
                <strong>Talhão: </strong> {operacao.tal_descricao}
            </div>
            <div className="info-operacao">
                Periodo: {operacao.data_init} - {operacao.data_fim}
            </div>
            <div className="info-operacao">
                <strong>Status: </strong> {operacao.status}
            </div>
        </div>
    </div>
}

export default InfoOperacaoMapa;



