import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import Mapa from './mapa';
import Mapa2 from './mapa2';

import Tabela from './tabela';
import Carrosel from "./carrosel";


function MapaGeral() {

    const [posicoes , setPosicoes] = useState([]);

    const [markerTabela, setMarkerTabela] = useState([]);
    const [center, setCenter] = useState([-22.21537,-49.653947]);
    const [dados, setDados] = useState([]);
    const [geojson, setGeoJson] = useState([]);

    

    function onHoverRow (latlon) {
      setCenter(latlon);
      setMarkerTabela(latlon);
    }

    useEffect( async () => {
        let form = new FormData();
        form.append('id_cliente', 200078);
        form.append('id_ativo', 525942);
        form.append('id_motorista', 0);
        form.append('timezone', 'America/Sao_Paulo');
        form.append('dt_inicial', '18/02/2021 00:00:00');
        form.append('dt_final', '18/02/2021 23:59:59');
        form.append('idioma', 'pt-BR');
        form.append('id_indice', 403138);
        form.append('id_usuario', 83713);
        form.append('pagination_client', 1);

        let response = await api.post('/relatorio/HistoricoPosicao/gerar/', form)
        let { rows } = response.data;
        let posicoesTratadas = rows.map((row) => {
          return row.lst_localizacao
        })

        let retorno = await fetch("https://fulltrackstatic.s3.amazonaws.com/kmz/118z18onond7713j617j6s6j738fao3a18ann7sn177jzad78-pt-br.json")
        // let retorno = await fetch("https://cartovis-server.herokuapp.com/hospitales")
        let geojson = await retorno.json();

        setGeoJson(geojson)
        setDados(rows)
        setPosicoes(posicoesTratadas)

    }, [])

  
  return (
      <>
        <Mapa geojson={geojson} dados={dados} polyline={posicoes} makers={markerTabela} centerMap={center} />
        {/* <Mapa2 /> */}
        <Tabela onHoverRow={onHoverRow} dados={dados} />
        <Carrosel />
      </>
  );
}

export default MapaGeral;
