import React from 'react'
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import './DataRangerPicker.css'

function Data(props) {
    
    return (
        <DateRangePicker
            initialSettings={{
                autoApply:true,
                timePicker:true,
                timePickerSeconds:true,
                timePicker24Hour:true,
                applyButtonClasses: false,
                locale:{
                    daysOfWeek:[
                        "Dom",
                        "Seg",
                        "Ter",
                        "Qua",
                        "Qui",
                        "Sex",
                        "Sab",
                    ],
                    monthNames:[
                        "Jan",
                        "Fev",
                        "Mar",
                        "Abr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Ago",
                        "Set",
                        "Out",
                        "Nov",
                        "Dez",
                    ]
                }
            }}
            onHide={props.onChangeData}
            
        >
            <button className="btn-show-daterangepicker">{props.startDate} - {props.endDate}</button>
        </DateRangePicker>
    )
}

export default Data