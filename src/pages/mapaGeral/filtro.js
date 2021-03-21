import React, { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
// import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import * as moment from 'moment'
import 'bootstrap-daterangepicker/daterangepicker.css';
import './filtro.css'

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
                initialSettings={{
                    startDate: startDate, 
                    endDate: endDate,
                    timePicker: true,
                    timePicker24Hour: true,
                    linkedCalendars: false,
                    showCustomRangeLabel: false,
                    timePickerSeconds: true,
                    locale:{
                        format: 'DD/MM/YYYY HH:mm:ss',
                    }
                }}
                onApply={onChangeData}
            >
                <button>Click Me To Open Picker!</button>
            </DateRangePicker>
            <button onClick={() => props.onclickButtonGerar({ dt_inicial: startDate, dt_final: endDate })}>Gerar Relatorio</button>
        </div>
    )
}

export default Filtro


