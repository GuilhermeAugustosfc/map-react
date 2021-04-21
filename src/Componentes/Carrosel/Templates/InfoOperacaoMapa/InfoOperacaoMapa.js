import React from 'react';
import './InfoOperacaoMapa.css'

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
                <strong>Motorista: </strong> {operacao.osr_motorista}
            </div>
            <div className="info-operacao">
                <strong>Implemento: </strong> {operacao.imp_descricao}
            </div>
            <div className="info-operacao">
                <strong>Talhão: </strong> {operacao.tal_descricao}
            </div>
        </div>
    </div>
}

export default InfoOperacaoMapa;



