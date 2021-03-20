import React, { useEffect, useState } from 'react'
import { ptBR } from 'date-fns/locale'
import 'react-nice-dates/build/style.css'


import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import './filtro.css'

function Filtro(props) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
    }, [startDate, endDate])

    return (
        <div className="filtro">
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                minimumLength={1}
                format='dd MMM yyyy'
                locale={ptBR} 
            >
                {({ startDateInputProps, endDateInputProps, focus }) => (
                    <div className='date-range'>
                    <input
                        className={'input' + (focus === START_DATE ? ' -focused' : '')}
                        {...startDateInputProps}
                        placeholder='Start date'
                    />
                    <span className='date-range_arrow' />
                    <input
                        className={'input' + (focus === END_DATE ? ' -focused' : '')}
                        {...endDateInputProps}
                        placeholder='End date'
                    />
                    </div>
                )}
            </DateRangePicker>
            <button onClick={() => props.onclickButtonGerar({dt_inicial:startDate, dt_final: endDate})}>Gerar Relatorio</button>
        </div>
    )
}

export default Filtro