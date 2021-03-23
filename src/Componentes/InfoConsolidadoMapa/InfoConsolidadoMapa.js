import React, { useEffect } from 'react';
import './InfoConsolidadoMapa.css'
import * as Go from "react-icons/go";
export default function ({ dados, onClickConsolidado }) {

    useEffect(() => {
        
    }, [dados])

    return <div className="painelConsolidado">
        <div className="painel-body">
            <div className="card-info tempoTrabalho" onClick={() => onClickConsolidado('tempoTrabalho', dados)} title="Tempo Trabalho">
                <Go.GoCheck size={45} color={"green"} />
                <div className="porcValor">
                    <span>{dados.tempoTrabalho}</span>
                    <div>Tempo trabalhado</div>
                </div>
            </div>
            <div className="card-info tempDeslocamneto" onClick={() => onClickConsolidado('tempDeslocamneto', dados)} title="Tempo Deslocamento">
                <Go.GoAlert size={45} color={"#000000ba"} />
                <div className="porcValor">
                    <div>{dados.porcForaCerca.toFixed(2)}%</div>
                    <span>{dados.deslocamento}</span>
                    <div>Deslocamento</div>
                </div>
            </div>
            <div className="card-info tempoDentroCerca" onClick={() => onClickConsolidado('tempoDentroCerca', dados)} title="Tempo Dentro Cerca">
                <Go.GoMilestone size={45} color={"orange"} />
                <div className="porcValor">
                    <div>{dados.porcDentroCerca.toFixed(2)}%</div>
                    <span>{dados.tempoDentroCerca}</span>
                    <div>Dentro Cerca</div>
                </div>
            </div>
        </div>
        <div className="painel-body">
            <div className="card-info tempoEfetivo" onClick={() => onClickConsolidado('tempoEfetivo', dados)} title="Tempo Efetivo">
                <Go.GoFlame size={45} color={"#00008b"} />
                <div className="porcValor">
                    <div>{dados.porcDentroCercaTrabalhando.toFixed(2)}%</div>
                    <span>{dados.tempoDentroCercaTrabalhando}</span>
                </div>
            </div>
            <div className="card-info tempoOcioso" onClick={() => onClickConsolidado('tempoOcioso', dados)} title="Tempo Ocioso">
                <Go.GoFlame size={45} color={"#868b00"} />
                <div className="porcValor">
                    <div>{dados.porcDentroCercaOcioso.toFixed(2)}%</div>
                    <span>{dados.tempoDentroCercaOcioso}</span>

                </div>
            </div>
            <div className="card-info tempoDesligado" onClick={() => onClickConsolidado('tempoDesligado', dados)} title="Tempo Desligado">
                <Go.GoFlame size={45} color={"darkred"} />
                <div className="porcValor">
                    <div>{dados.porcDentroCercaDesligado.toFixed(2)}%</div>
                    <span>{dados.tempoDentroCercaDesligado}</span>
                </div>
            </div>
        </div>
    </div>

}



