
import React, { useState } from 'react'
import * as moment from 'moment'
import './FiltroMapa.css'

// import DateRangePicker from "../DataRangerPicker/DataRangerPicker"

function Filtro(props) {
    // const [startDate, setStartDate] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    // const [endDate, setEndDate] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));

    // function onChangeData(ev, picker) {
        // setStartDate(picker.startDate.format('DD/MM/YYYY HH:mm:ss')) 
        // setEndDate(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
        // props.onclickButtonGerar({ dt_inicial: picker.startDate.format('DD/MM/YYYY HH:mm:ss'), dt_final: picker.endDate.format('DD/MM/YYYY HH:mm:ss') })
    // }

    return (
        <div className="filtro">
            <select className="filtro-select-mapas" onChange={(e) => props.onChangeMapSelectMap(e.target.value)}>
                <option value="velocidade">Velocidade</option>
                <option value="eficiencia">Eficiencia Ha.</option>
            </select>
        </div>
    )
}

export default Filtro


