import React from 'react'
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import './DataRangerPicker.css'

function Data(props) {
    return (
        <DateRangePicker
            initialSettings={props.initialSettings}
            onHide={props.onChangeData}
        >
            <button className="btn-show-daterangepicker">{props.initialSetings.startDate} - {props.initialSetings.endDate}</button>
        </DateRangePicker>
    )
}

export default Data