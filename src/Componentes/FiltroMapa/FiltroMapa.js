
import React, { useState } from 'react'
import * as moment from 'moment'
import './FiltroMapa.css'

import DateRangePicker from "../DataRangerPicker/DataRangerPicker"

function Filtro(props) {
    const [startDate, setStartDate] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    const [endDate, setEndDate] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));

    function onChangeData(ev, picker) {
        setStartDate(picker.startDate.format('DD/MM/YYYY HH:mm:ss')) 
        setEndDate(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
        props.onclickButtonGerar({ dt_inicial: picker.startDate.format('DD/MM/YYYY HH:mm:ss'), dt_final: picker.endDate.format('DD/MM/YYYY HH:mm:ss') })
    }

    return (
        <div className="filtro">
            <DateRangePicker 
                onChangeData={onChangeData}
                startDate={startDate}
                endDate={endDate}
            />

            <button onClick={() => props.onclickButtonGerar({ dt_inicial: startDate, dt_final: endDate })}>Gerar Relatorio</button>
        </div>
    )
}

export default Filtro


