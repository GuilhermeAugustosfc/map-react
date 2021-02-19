import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import Mapa from './mapa'
import Tabela from './tabela'
import Carrosel from "./carrosel"

function MapaGeral() {

    const [posicoes , setPosicoes] = useState([]);

    const [markerTabela, setMarkerTabela] = useState([]);
    const [center, setCenter] = useState([-22.21537,-49.653947]);

    function onHoverRow (latlon) {
      setCenter(latlon);
      setMarkerTabela(latlon);
    }

    useEffect( async () => {
        console.log(posicoes);
        let form = new FormData();
        form.append('id_cliente', 72724);
        form.append('id_ativo', 156167);
        form.append('id_motorista', 0);
        form.append('timezone', 'America/Sao_Paulo');
        form.append('dt_inicial', '01/01/2021 00:00:00');
        form.append('dt_final', '18/02/2021 23:59:59');
        form.append('idioma', 'pt-BR');
        form.append('id_indice', 7112);
        form.append('id_usuario', 83713);
        form.append('pagination_client', 1);

        let response = await api.post('/relatorio/HistoricoPosicao/gerar/', form)
        let { rows } = response.data;

        let posicoesTratadas = rows.map((row) => {
            return row.lst_localizacao
        })

        setPosicoes(posicoesTratadas)

    }, [])

  
  return (
      <>
        <Mapa polyline={posicoes} makers={markerTabela} centerMap={center} />
        <Tabela onHoverRow={onHoverRow} dados={posicoes} />
        <Carrosel />
      </>
  );
}

export default MapaGeral;