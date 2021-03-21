import React, { useEffect } from 'react';
import './consolidado.css'
export default function ({ dados }) {

    useEffect(() => {
        console.log(dados);
    }, [dados])
    return <div className="painelConsolidado">
        <div className="tempoTrabalho">
            <strong>Tempo trabalho</strong> {dados.tempoTrabalho}
        </div>
        <div className="deslocamento">
            <strong>Tempo deslocamento</strong> {dados.deslocamento}
        </div>
        <div className="tempoDentroCerca">
            <strong>Tempo Dentro Cerca</strong> {dados.tempoDentroCerca}
        </div>
    </div>
}