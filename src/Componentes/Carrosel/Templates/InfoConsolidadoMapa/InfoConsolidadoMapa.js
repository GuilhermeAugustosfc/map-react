import React from 'react';
import './InfoConsolidadoMapa.css'
import * as Go from "react-icons/go";

const InfoConsolidadoMapa = function ({ consolidado }) {

    return <div className="painelConsolidado">
        <div className="card">
            <div className="card-info tempoTrabalho" title="Tempo Trabalho">
                <Go.GoCheck size={45} color={"green"} />
                <div className="porcValor">
                    <span>{consolidado.tempoTrabalho}</span>
                    <div>Tempo Jornada</div>
                </div>
            </div>
            <div className="card-info tempDeslocamneto" title="Tempo Deslocamento">
                <Go.GoAlert size={45} color={"#000000ba"} />
                <div className="porcValor">
                    <div>{consolidado.porcForaCerca.toFixed(2)}%</div>
                    <span>{consolidado.deslocamento}</span>
                    <div>Deslocamento</div>
                </div>
            </div>
            <div className="card-info tempoDentroCerca" title="Tempo Dentro Cerca">
                <Go.GoMilestone size={45} color={"orange"} />
                <div className="porcValor">
                    <div>{consolidado.porcDentroCerca.toFixed(2)}%</div>
                    <span>{consolidado.tempoDentroCerca}</span>
                    <div>Dentro Cerca</div>
                </div>
            </div>
        </div>
        <div className="card">
            <div className="card-info tempoEfetivo" title="Tempo Efetivo">
                <Go.GoFlame size={45} color={"#00008b"} />
                <div className="porcValor">
                    <div>{consolidado.porcDentroCercaTrabalhando.toFixed(2)}%</div>
                    <span>{consolidado.tempoDentroCercaTrabalhando}</span>
                    <div>Efetivo</div>
                </div>
            </div>
            <div className="card-info tempoOcioso" title="Tempo Ocioso">
                <Go.GoFlame size={45} color={"#868b00"} />
                <div className="porcValor">
                    <div>{consolidado.porcDentroCercaOcioso.toFixed(2)}%</div>
                    <span>{consolidado.tempoDentroCercaOcioso}</span>
                    <div>Ocioso</div>
                </div>
            </div>
            <div className="card-info tempoDesligado" title="Tempo Desligado">
                <Go.GoFlame size={45} color={"darkred"} />
                <div className="porcValor">
                    <div>{consolidado.porcDentroCercaDesligado.toFixed(2)}%</div>
                    <span>{consolidado.tempoDentroCercaDesligado}</span>
                    <div>Desligado</div>
                </div>
            </div>
        </div>

    </div>
}

export default InfoConsolidadoMapa;



