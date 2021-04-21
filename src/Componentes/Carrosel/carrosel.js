import React, { useEffect, useState } from 'react'

import InfoConsolidadoMapa from './Templates/InfoConsolidadoMapa/InfoConsolidadoMapa'
import TemplateOperacao from './Templates/InfoOperacaoMapa/InfoOperacaoMapa'
import TemplateConfigOperacao from './Templates/InfoConfigOperacaoMapa/InfoConfigOperacaoMapa'
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import './carrosel.css';

function Carrosel(props) {

    const [templates, setTemplates] = useState([
        InfoConsolidadoMapa, TemplateTest, TemplateTest, TemplateTest, TemplateTest
    ]);

    const options = {
        items: 4,
        nav: false,
        rewind: true,
        merge: true
    };

    const events = {
        onDragged: function (event) { },
        onChanged: function (event) { }
    };

    function TemplateTest() {
        return (
            <>
                <h5>Ultimos evnetos</h5>
                <ul>
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </>
        )
    }
    useEffect(() => {
        if (Object.keys(props.operacao).length) {
            setTemplates((templates) => [...[TemplateOperacao, TemplateConfigOperacao],...templates])
        }
        console.log(props);
    }, [props])

    return (
        <OwlCarousel options={options} events={events} >
            {templates.map((Component, index) => (
                <div className="template-scrol-horizontal" key={index}>
                    <Component {...props} />
                </div>
            ))}
        </OwlCarousel>

    );
}

function carroselPropsAreEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps.consolidado) === JSON.stringify(nextProps.consolidado)
      && JSON.stringify(prevProps.operacao) === JSON.stringify(nextProps.operacao);
  }

export default React.memo(Carrosel, carroselPropsAreEqual);
