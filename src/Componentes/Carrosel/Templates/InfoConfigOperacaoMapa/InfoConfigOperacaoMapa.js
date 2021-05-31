import React from 'react';
import './InfoConfigOperacaoMapa.css'

const InfoConfigOperacaoMapa = function ({ operacao }) {
   
    return <div id="painel-operacao">
        <div className="operacao">
            CONFIGURAÇÃO
        </div>
        <div className="bloco-operacao">
            <div className="info-operacao">
                <strong>Velocidade: </strong> {operacao.osr_velocidade}
            </div>
            <div className="info-operacao">
                <strong>Rpm: </strong> {operacao.osr_rpm}
            </div>
            <div className="info-operacao">
                <strong>Combustivel: </strong> {operacao.osr_combustivel}
            </div>
            <div className="info-operacao">
                <strong>Marcha: </strong> {operacao.osr_marcha}
            </div>
            <div className="info-operacao">
                <strong>Tempo Cinquenta metro: </strong> {operacao.osr_tmp_cinq_metros}
            </div>
            <div className="info-operacao">
                Periodo: {operacao.data_init} - {operacao.data_fim}
            </div>
        </div>
    </div>
}

export default InfoConfigOperacaoMapa;



