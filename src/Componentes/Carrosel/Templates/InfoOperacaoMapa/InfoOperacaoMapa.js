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
            <div>
                <div className="info-operacao">
                    <strong><GiFireTail size={25} color={'yellow'} /></strong><p> {operacao.cul_descricao}</p>
                </div>
                <div className="info-operacao">
                    <strong><AiFillCar size={25} color={'#2f7eff'} /> </strong><p> {operacao.osr_veiculo}</p>
                </div>
            </div>
            <div>
                <div className="info-operacao">
                    <strong><IoIosSpeedometer size={25} color={'#5ccd5c'} /> </strong><p> {operacao.osr_velocidade}</p>
                </div>
                <div className="info-operacao">
                    <strong><GiFarmer size={25} color={'#b7b7b7'} /> </strong><p> {operacao.osr_motorista}</p>
                </div>
            </div>
        </div>


        <div className="info-operacao">
            <strong><GiFarmTractor size={25} color={'blanchedalmond'} /> </strong><p> {operacao.imp_descricao}</p>
        </div>
        <div className="info-operacao">
            <p> {operacao.data_init} - {operacao.data_fim}</p>
        </div>
        <div className="info-operacao">
            <strong>Status: </strong><p> {operacao.status}</p>
        </div>

    </div>
}

export default InfoOperacaoMapa;



