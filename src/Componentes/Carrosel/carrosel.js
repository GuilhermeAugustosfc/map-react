import React, { useEffect } from 'react'

import InfoConsolidadoMapa from './Templates/InfoConsolidadoMapa/InfoConsolidadoMapa'
import TemplateOperacao from './Templates/InfoOperacaoMapa/InfoOperacaoMapa'
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import './carrosel.css';

function Carrosel(props) {

    const options = {
        items: 3,
        nav: false,
        rewind: true,
        merge: true
    };

    const events = {
        onDragged: function (event) { },
        onChanged: function (event) { }
    };

    const TemplateTest = () => {
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
    }, [])


    return (
        <OwlCarousel options={options} events={events} >
            {[TemplateOperacao, InfoConsolidadoMapa, TemplateTest, TemplateTest, TemplateTest, TemplateTest].map((Component, index) => (
                <div className="template-scrol-horizontal" key={index}>
                    <Component {...props} />
                </div>
            ))}
        </OwlCarousel>

    );
}

export default Carrosel;
