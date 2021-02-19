import React from 'react'
// import Carousel, { slidesToShowPlugin, centeredPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import './../../App.css';

function Carrosel() {

    const options = {
        items: 3,
        nav: false,
        rewind: true,
        merge: true
    };

    const events = {
        onDragged: function(event) {},
        onChanged: function(event) {}
    };

    return (
        <OwlCarousel options={options} events={events} >
           <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
            <div className="template-scrol-horizontal">
                <h5>Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
        </OwlCarousel>

    );
}

export default Carrosel;