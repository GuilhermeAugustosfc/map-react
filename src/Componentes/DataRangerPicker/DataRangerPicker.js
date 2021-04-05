import React from 'react'
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import './DataRangerPicker.css'

function Data(props) {
    return (
        <DateRangePicker
            initialSettings={{
                startDate: props.startDate,
                endDate: props.endDate,
                timePicker: true,
                timePicker24Hour: true,
                linkedCalendars: false,
                showCustomRangeLabel: false,
                timePickerSeconds: true,
                locale: {
                    format: 'DD/MM/YYYY HH:mm:ss',
                }
            }}
            onApply={props.onChangeData}
        >
            <button className="btn-show-daterangepicker">{props.startDate} - {props.endDate}</button>
        </DateRangePicker>
    )
}

export default Data