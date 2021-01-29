import React, {useEffect} from 'react'
import './App.css';
import { ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-navigations';

function Toolbar() {

    useEffect(() => {
        document.querySelector('.toolbar-sample').style.maxWidth = "100%";
        document.querySelector('.toolbar-sample').style.width = "100%"
    }, [])

    const ultimosEventos = () => {
        return (
            <div className="template-scrol-horizontal">
                <h5 >Ultimos evnetos</h5>
                <ul>    
                    <li><strong>Data</strong> : 12/11/2020</li>
                    <li><strong>Motorista</strong> : Ricardo martins</li>
                    <li><strong>Ignição</strong> : Ligado</li>
                    <li><strong>Temperatura</strong> : 15 graus</li>
                    <li><strong>Velocidade</strong> : 20km</li>
                    <li><strong>Endereço</strong> : Rua das flores</li>
                </ul>
            </div>
        )
    }
    return (
        <div className='control-pane'>
            <div className='control-section tbar-control-section'>
                <div className='control toolbar-sample tbar-sample' style={{ margin: '25px 0'}}>
                    <ToolbarComponent >
                        <ItemsDirective >
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                            <ItemDirective template={ultimosEventos} prefixIcon='e-cut-icon tb-icons' tooltipText='Cut' />
                            <ItemDirective type='Separator' />
                        </ItemsDirective>
                    </ToolbarComponent>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
