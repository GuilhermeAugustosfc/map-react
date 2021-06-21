
import React, { useEffect, useRef, useState } from 'react'
import './FiltroMapa.css'


// import DateRangePicker from "../DataRangerPicker/DataRangerPicker"

function Filtro({ onChangeMapSelectMap, dadosConsolidado }) {
    // const [startDate, setStartDate] = useState(moment().startOf('date').format('DD/MM/YYYY HH:mm:ss'));
    // const [endDate, setEndDate] = useState(moment().endOf('date').format('DD/MM/YYYY HH:mm:ss'));

    const [showChart, setShowChart] = useState(false) 
    const [areas, setAreas] = useState({
        trabalhadas:0,
        restantes:0
    })

    // function onChangeData(ev, picker) {
    // setStartDate(picker.startDate.format('DD/MM/YYYY HH:mm:ss')) 
    // setEndDate(picker.endDate.format('DD/MM/YYYY HH:mm:ss'))
    // props.onclickButtonGerar({ dt_inicial: picker.startDate.format('DD/MM/YYYY HH:mm:ss'), dt_final: picker.endDate.format('DD/MM/YYYY HH:mm:ss') })
    // }

    useEffect(() => {
        if (dadosConsolidado.hasOwnProperty("porcTalhaoRestante") && dadosConsolidado.hasOwnProperty("porcTalhaoTrabalhado")) {
            setAreas({
                trabalhadas: parseInt(dadosConsolidado.porcTalhaoTrabalhado),
                restantes: parseInt(dadosConsolidado.porcTalhaoRestante)
            });

            setShowChart(true);
        }

    }, [dadosConsolidado])

    return (
        <div className="filtro">
            <select className="filtro-select-mapas" onChange={(e) => onChangeMapSelectMap(e.target.value)}>
                <option value="velocidade">Velocidade</option>
                <option value="eficiencia">Eficiencia Ha.</option>
                <option value="streetComplete">Ruas completas</option>
            </select>

            {showChart && (
                <div className="areas">
                    <p className="trabalhados">Areas trabalhadas : {areas.trabalhadas}%</p>
                    <p className="restantes">Areas restantes : {areas.restantes}%</p>
                </div>
            )}
        </div>
    )
}

export default Filtro


