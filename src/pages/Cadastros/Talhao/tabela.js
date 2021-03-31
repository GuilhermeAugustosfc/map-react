import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import api from '../../../services/api'
import { useHistory } from "react-router";

import { GoBook } from 'react-icons/go'


import '../../../pages/Tabela/tabela.css'

const TalhaoTabela = () => {

    const [dadosTalhao, setDadosTalhao] = useState([{
        id: 0,
        tal_codigo: 0,
        tal_descricao: "",
        tal_area_util: 0.0,
        tal_coordenada: null
    }]);


    const columnsTalhao = [
        {
            field: 'id', headerName: 'Action', align: 'center', headerAlign: 'center',
            renderCell: (value) => {
                return <GoBook size={30} style={{ cursor: 'pointer', color: '#355b9a' }} onClick={() => console.log(value.row)} />;
            }
        },
        {
            field: 'tal_codigo', headerName: 'Codigo', align: 'center', headerAlign: 'center',
            valueGetter: (value) => value.row.tal_codigo ? value.row.tal_codigo : 0

        },
        { field: 'tal_descricao', headerName: 'Descrição talhão', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'tal_area_util', headerName: 'Area util', type: 'number', flex: 1, align: 'center', headerAlign: 'center',
            valueFormatter: (value) => value.row.tal_area_util
        },
        {
            field: 'tal_coordenada', headerName: 'Coordenadas', flex: 1, type: 'number', align: 'center', headerAlign: 'center',
            valueFormatter: (value) => {
                // if (!value.element) return

                // if (value.value > 60) {
                //     value.element.style.backgroundColor = "#FF6347";
                // } else if (value.value > 40) {
                //     value.element.style.backgroundColor = "#FFA500";
                // } else if (value.value > 20) {
                //     value.element.style.backgroundColor = "#FFFF00";
                // } else {
                //     value.element.style.backgroundColor = "#82ff47";
                // }

                // value.element.style.cursor = "pointer";
                // value.element.setAttribute("title", value.getValue("total_movimento"));

                return `${value.value} %`;

            },
            valueGetter: (params) => parseInt(params.value) || 0
        },
    ];

    useEffect(() => {
        api.get('http://f-agro-api.fulltrackapp.com/talhao/', {}, ({ data }) => {

            data = data.map((row, index) => {
                return { ...row, ...{ id: index } }
            })

            setDadosTalhao(data);
        })


    }, []);


    return (
        <div className="ContainerDatagrid">
            <DataGrid key="dataGridtalhao" className="DataGrid" rows={dadosTalhao} columns={columnsTalhao} />
        </div>
    );

}

export default TalhaoTabela;