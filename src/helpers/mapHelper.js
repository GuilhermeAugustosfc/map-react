import * as moment from 'moment'
import * as turf from "@turf/turf"

export function calcColorSpeed(speed, velocidadeCorreta) {
    // var i,
    //     speedThresholds = [6, 9, 13];

    // for (i = 0; i < speedThresholds.length; ++i) {
    //     if (speed < speedThresholds[i]) {
    //         return i;
    //     }
    // }
    // return speedThresholds.length;

    if (speed < velocidadeCorreta) {
        return 0; // amarelo
    } else if (speed > velocidadeCorreta) {
        return 1; // vermelho
    } else return 2 // verde
}

export const consolidado = {
    tempoTrabalho: 0,
    tempoDentroCerca: 0,
    tempoDeslocamento: 0, // Deslocamento
    tempoDentroCercaOcioso: 0, // ignição = 1 Velocidade = 0
    tempoDentroCercaDesligado: 0, // ignição = 0
    tempoDentroCercaTrabalhando: 0,
    dataInicioViagem: null,
    dataFimViagem: null,
    ultimoEventoDeslocamento: 0,
    ultimoEventoDentroCerca: 0,
    ultimoEventoDentroCercaTrabalhando: 0, // Velocidade > 0
    ultimoEventoDentroCercaOcioso: 0,
    ultimoEventoDentroCercaDesligado: 0,
    posicoesDesligadas: [],
    posicoesOciosas: [],
    posicoesDeslocamento: [],
    posicoesTrabalhando: [],
    consolidado: {
        tempoTrabalho: "00:00:00",
        deslocamento: "00:00:00",
        tempoDentroCerca: "00:00:00",
        tempoDentroCercaDesligado: "00:00:00",
        tempoDentroCercaOcioso: "00:00:00",
        tempoDentroCercaTrabalhando: "00:00:00",
        porcDentroCerca: 0,
        porcForaCerca: 0,
        porcDentroCercaOcioso: 0,
        porcDentroCercaDesligado: 0,
        porcDentroCercaTrabalhando: 0,
        posicoesDesligadas: [],
        posicoesOciosas: [],
        posicoesDeslocamento: [],
        posicoesTrabalhando: [],
    },
    resetConsolidado: function () {
        this.tempoTrabalho = 0;
        this.tempoDentroCerca = 0;
        this.tempoDeslocamento = 0; // Deslocamento
        this.ultimoEventoDentroCercaTrabalhando = 0; // Velocidade > 0
        this.tempoDentroCercaOcioso = 0; // ignição = 1 Velocidade = 0
        this.tempoDentroCercaDesligado = 0; // ignição = 0
        this.tempoDentroCercaTrabalhando = 0;
        this.dataInicioViagem = null;
        this.dataFimViagem = null;
        this.ultimoEventoDeslocamento = 0;
        this.ultimoEventoDentroCerca = 0;
        this.ultimoEventoDentroCercaOcioso = 0;
        this.ultimoEventoDentroCercaDesligado = 0;
        this.posicoesDesligadas = [];
        this.posicoesOciosas = [];
        this.posicoesDeslocamento = [];
        this.posicoesTrabalhando = [];
    },
    calcularTempo: function (tempos, dt_atual) {
        let config = {
            ocioso: {
                evento: 'ultimoEventoDentroCercaOcioso',
                tempo: 'tempoDentroCercaOcioso'
            },
            trabalhando: {
                evento: 'ultimoEventoDentroCercaTrabalhando',
                tempo: 'tempoDentroCercaTrabalhando'
            },
            desligado: {
                evento: 'ultimoEventoDentroCercaDesligado',
                tempo: 'tempoDentroCercaDesligado'
            },
            deslocamento: {
                evento: 'ultimoEventoDeslocamento',
                tempo: 'tempoDeslocamento'
            },
            dentro_cerca: {
                evento: 'ultimoEventoDentroCerca',
                tempo: 'tempoDentroCerca'
            }
        }

        for (var i in tempos) {

            if (this[config[tempos[i]].evento]) {
                this[config[tempos[i]].tempo] += ((dt_atual - this[config[tempos[i]].evento]) / 1000);
                this[config[tempos[i]].evento] = 0;
            }
        }
    },
    consolidarRealTime: function (obj) { // RETORNAR O CONSOLIDADO A CADA MOMENTO

        if (!obj.cercaConsolidado) {
            return
        }

        if (!obj.eventoAtual) {
            return this.consolidado;
        }

        if (!this.dataInicioViagem) {
            this.dataInicioViagem = obj.eventoAtual.ras_eve_data_gps;
        }

        this.dtGpsAtualDateTime = new Date(moment(obj.eventoAtual.ras_eve_data_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));

        if (turf.inside(turf.point(obj.eventoAtual.lst_localizacao), obj.cercaConsolidado)) { // DENTRO DA CERCA

            this.calcularTempo(['deslocamento'], this.dtGpsAtualDateTime);

            if (!this.ultimoEventoDentroCerca) {
                this.ultimoEventoDentroCerca = this.dtGpsAtualDateTime;
            } else {
                this.tempoDentroCerca += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCerca) / 1000);
                this.ultimoEventoDentroCerca = this.dtGpsAtualDateTime;
            }

            if (obj.eventoAtual.flg_ignicao) {

                if (obj.eventoAtual.vl_velocidade > 0) {

                    this.posicoesTrabalhando.push(obj.eventoAtual.lst_localizacao)

                    if (!this.ultimoEventoDentroCercaTrabalhando) {
                        this.ultimoEventoDentroCercaTrabalhando = this.dtGpsAtualDateTime;
                    } else {
                        this.tempoDentroCercaTrabalhando += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCercaTrabalhando) / 1000);
                        this.ultimoEventoDentroCercaTrabalhando = this.dtGpsAtualDateTime;
                    }

                    this.calcularTempo(['ocioso', 'desligado'], this.dtGpsAtualDateTime);
                } else {
                    this.posicoesOciosas = obj.eventoAtual.lst_localizacao;

                    if (!this.ultimoEventoDentroCercaOcioso) {
                        this.ultimoEventoDentroCercaOcioso = this.dtGpsAtualDateTime;
                    } else {
                        this.tempoDentroCercaOcioso += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCercaOcioso) / 1000);
                        this.ultimoEventoDentroCercaOcioso = this.dtGpsAtualDateTime;
                    }

                    this.calcularTempo(['trabalhando', 'desligado'], this.dtGpsAtualDateTime);
                }
            } else {

                this.posicoesDesligadas.push(obj.eventoAtual.lst_localizacao);

                if (!this.ultimoEventoDentroCercaDesligado) {
                    this.ultimoEventoDentroCercaDesligado = this.dtGpsAtualDateTime;
                } else {
                    this.tempoDentroCercaDesligado += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCercaDesligado) / 1000);
                    this.ultimoEventoDentroCercaDesligado = this.dtGpsAtualDateTime;
                }

                this.calcularTempo(['trabalhando', 'ocioso'], this.dtGpsAtualDateTime);
            }

        } else { //  FORA DA CERCA

            this.posicoesDeslocamento.push(obj.eventoAtual.lst_localizacao);

            if (!this.ultimoEventoDeslocamento) {
                this.ultimoEventoDeslocamento = this.dtGpsAtualDateTime;
            } else {
                this.tempoDeslocamento += ((this.dtGpsAtualDateTime - this.ultimoEventoDeslocamento) / 1000);
                this.ultimoEventoDeslocamento = this.dtGpsAtualDateTime;
            }

            this.calcularTempo(['trabalhando', 'ocioso', 'desligado', 'dentro_cerca'], this.dtGpsAtualDateTime);
        }

        this.dtFinalSeg = new Date(moment(this.dtGpsAtualDateTime, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.dtInicialSeg = new Date(moment(this.dataInicioViagem, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.tempoTrabalhoAtual = ((this.dtFinalSeg - this.dtInicialSeg) / 1000);

        this.consolidado = {
            tempoTrabalho: moment.utc(this.tempoTrabalhoAtual * 1000).format('HH:mm:ss'),
            deslocamento: moment.utc(this.tempoDeslocamento * 1000).format('HH:mm:ss'),
            tempoDentroCerca: moment.utc(this.tempoDentroCerca * 1000).format('HH:mm:ss'),
            tempoDentroCercaDesligado: moment.utc(this.tempoDentroCercaDesligado * 1000).format('HH:mm:ss'),
            tempoDentroCercaOcioso: moment.utc(this.tempoDentroCercaOcioso * 1000).format('HH:mm:ss'),
            tempoDentroCercaTrabalhando: moment.utc(this.tempoDentroCercaTrabalhando * 1000).format('HH:mm:ss'),
            porcDentroCerca: parseFloat((100 * this.tempoDentroCerca) / this.tempoTrabalhoAtual),
            porcForaCerca: parseFloat((100 * this.tempoDeslocamento) / this.tempoTrabalhoAtual),
            porcDentroCercaOcioso: parseFloat((100 * this.tempoDentroCercaOcioso) / this.tempoTrabalhoAtual),
            porcDentroCercaDesligado: parseFloat((100 * this.tempoDentroCercaDesligado) / this.tempoTrabalhoAtual),
            porcDentroCercaTrabalhando: parseFloat((100 * this.tempoDentroCercaTrabalhando) / this.tempoTrabalhoAtual),
            posicoesDesligadas: this.posicoesDesligadas,
            posicoesOciosas: this.posicoesOciosas,
            posicoesDeslocamento: this.posicoesDeslocamento,
            posicoesTrabalhando: this.posicoesTrabalhando,
        }

        return this.consolidado;

    },
    consolidarTodosDados: function (dados, cercaConsolidado) {
        if (!dados.length) {
            return this.consolidado
        }

        if (!cercaConsolidado) {
            return
        }

        let largura = 2; // 2 metros de largura
        let distanciaPercorridaMetros = 0;
        for (var i in dados) {
            if (!this.dataInicioViagem) {
                this.dataInicioViagem = dados[i].dt_gps;
            }

            this.dtGpsAtualDateTime = new Date(moment(dados[i].dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));

            if (turf.inside(turf.point(dados[i].lst_localizacao), cercaConsolidado)) { // DENTRO DA CERCA
                this.calcularTempo(['deslocamento'], this.dtGpsAtualDateTime);

                if (!this.ultimoEventoDentroCerca) {
                    this.ultimoEventoDentroCerca = this.dtGpsAtualDateTime;
                }

                let proxIndex = parseInt(i) + 1;

                if (proxIndex <= dados.length - 1) {
                    distanciaPercorridaMetros += turf.distance(turf.point(dados[i].lst_localizacao), turf.point(dados[proxIndex].lst_localizacao), {units: 'meters'});
                }

                if (dados[i].flg_ignicao) {
                    if (dados[i].vl_velocidade > 0) {
                        if (!this.ultimoEventoDentroCercaTrabalhando) {
                            this.ultimoEventoDentroCercaTrabalhando = this.dtGpsAtualDateTime;
                        }
                        this.posicoesTrabalhando.push(dados[i].lst_localizacao)
                        this.calcularTempo(['ocioso', 'desligado'], this.dtGpsAtualDateTime);
                    } else {
                        this.posicoesOciosas.push(dados[i].lst_localizacao);

                        if (!this.ultimoEventoDentroCercaOcioso) {
                            this.ultimoEventoDentroCercaOcioso = this.dtGpsAtualDateTime;
                        }

                        this.calcularTempo(['trabalhando', 'desligado'], this.dtGpsAtualDateTime);
                    }
                } else {
                    this.posicoesDesligadas.push(dados[i].lst_localizacao);

                    if (!this.ultimoEventoDentroCercaDesligado) {
                        this.ultimoEventoDentroCercaDesligado = this.dtGpsAtualDateTime;
                    }

                    this.calcularTempo(['ocioso', 'trabalhando'], this.dtGpsAtualDateTime);
                }

            } else { //  FORA DA CERCA

                this.posicoesDeslocamento.push(dados[i].lst_localizacao)

                if (!this.ultimoEventoDeslocamento) {
                    this.ultimoEventoDeslocamento = this.dtGpsAtualDateTime;
                }

                this.calcularTempo(['ocioso', 'desligado', 'trabalhando', 'dentro_cerca'], this.dtGpsAtualDateTime);
            }
        }

        this.calcularTempo(['ocioso', 'desligado', 'deslocamento', 'trabalhando', 'dentro_cerca'], this.dtGpsAtualDateTime);

        let metrosQuadrados = distanciaPercorridaMetros * largura; 
        let hectaresPercorrido = turf.convertArea(metrosQuadrados.toFixed(2), 'meters', 'hectares');

        this.dtFinalSeg = new Date(moment(dados[(dados.length - 1)].dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.dtInicialSeg = new Date(moment(dados[0].dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.tempoTrabalhoAtual = ((this.dtFinalSeg - this.dtInicialSeg) / 1000);

        this.consolidado = {
            tempoTrabalho: moment.utc(this.tempoTrabalhoAtual * 1000).format('HH:mm:ss'),
            deslocamento: moment.utc(this.tempoDeslocamento * 1000).format('HH:mm:ss'),
            tempoDentroCerca: moment.utc(this.tempoDentroCerca * 1000).format('HH:mm:ss'),
            tempoDentroCercaDesligado: moment.utc(this.tempoDentroCercaDesligado * 1000).format('HH:mm:ss'),
            tempoDentroCercaOcioso: moment.utc(this.tempoDentroCercaOcioso * 1000).format('HH:mm:ss'),
            tempoDentroCercaTrabalhando: moment.utc(this.tempoDentroCercaTrabalhando * 1000).format('HH:mm:ss'),
            porcDentroCerca: parseFloat((100 * this.tempoDentroCerca) / this.tempoTrabalhoAtual),
            porcForaCerca: parseFloat((100 * this.tempoDeslocamento) / this.tempoTrabalhoAtual),
            porcDentroCercaOcioso: parseFloat((100 * this.tempoDentroCercaOcioso) / this.tempoTrabalhoAtual),
            porcDentroCercaDesligado: parseFloat((100 * this.tempoDentroCercaDesligado) / this.tempoTrabalhoAtual),
            porcDentroCercaTrabalhando: parseFloat((100 * this.tempoDentroCercaTrabalhando) / this.tempoTrabalhoAtual),
            posicoesDesligadas: this.posicoesDesligadas,
            posicoesOciosas: this.posicoesOciosas,
            posicoesDeslocamento: this.posicoesDeslocamento,
            posicoesTrabalhando: this.posicoesTrabalhando,
            distanciaPercorridaHectares: hectaresPercorrido.toFixed(2),
        }

        return this.consolidado
    }
}


export const formatLineInMap = {
    map: null,
    dados: [],
    indexInterval: 1,
    posAtual: [],
    rotaAtual: [],
    prevOptionIdx: null,
    optionIdx: null,
    segmentLatlngs: null,
    timer: null,
    colorsSpeed: [
        { color: 'yellow' }, { color: 'darkred' }, { color: 'green' }
    ],

    animacao: function (dados, map, velocidadeCorreta , callback) {
        let rota = {
            features: [],
            type: "FeatureCollection"
        }

        map.addSource('rota', {
            'type': 'geojson',
            'data': rota,
        });

        map.addLayer({
            'id': 'rota',
            'type': 'line',
            'source': 'rota',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
            },
            'paint': {
                'line-color': ['get', 'color'],
                'line-width': 3,
            }
        });

        this.map = map;
        this.dados = dados;
        this.indexInterval = 1;

        window.clearInterval(this.timer);

        this.map.jumpTo({ 'center': this.dados[0].lst_localizacao, 'zoom': 15 });
        this.map.setPitch(30);
        var rotaAtual = [];

        this.timer = window.setInterval(function () {

            if (this.indexInterval < this.dados.length) {
                this.optionIdx = calcColorSpeed(this.dados[this.indexInterval].vl_velocidade, velocidadeCorreta);

                if (this.indexInterval === 1) {
                    this.segmentLatlngs = [this.dados[0].lst_localizacao];
                    callback(this.dados[0]);
                }

                this.segmentLatlngs.push(this.dados[this.indexInterval].lst_localizacao);

                rotaAtual = this.map.getSource('rota')._data;
                rotaAtual.features.push({
                    'type': 'Feature',
                    'properties': {
                        'color': this.colorsSpeed[this.optionIdx].color,
                        'velocidade': this.dados[this.indexInterval].vl_velocidade,
                        'dt_gps': this.dados[this.indexInterval].dt_gps,
                        'desc_ativo': this.dados[this.indexInterval].desc_ativo,
                        'ignicao': this.dados[this.indexInterval].flg_ignicao,
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': this.segmentLatlngs
                    }
                })

                this.map.getSource('rota').setData(rotaAtual)

                this.segmentLatlngs = [this.dados[this.indexInterval].lst_localizacao]

                // this.map.panTo(this.segmentLatlngs);
                callback(this.dados[this.indexInterval])
                this.indexInterval++;

            } else {
                window.clearInterval(this.timer);
            }
        }.bind(this), 10);
    },

    lineOfSpeed: function (dados, velocidadeCorreta) {

        this.dados = dados;

        let geojson = {
            'type': 'FeatureCollection',
            'features': []
        };
        for (let i = 1; i < this.dados.length; ++i) {
            this.optionIdx = calcColorSpeed(this.dados[i].vl_velocidade, velocidadeCorreta);

            if (i === 1) {
                this.segmentLatlngs = [this.dados[0].lst_localizacao];
            }

            this.segmentLatlngs.push(this.dados[i].lst_localizacao);
            geojson.features.push({
                'type': 'Feature',
                'properties': {
                    'color': this.colorsSpeed[this.optionIdx].color,
                    'velocidade': this.dados[i].vl_velocidade,
                    'ignicao': this.dados[i].flg_ignicao,
                    'dt_gps': this.dados[i].dt_gps,
                    'desc_ativo': this.dados[i].desc_ativo,
                    'line-width': 3
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.segmentLatlngs
                }
            })

            this.segmentLatlngs = [this.dados[i].lst_localizacao];
        }

        return geojson;
    },
    lineOfWidht: function (dados, cerca) {

        this.dados = dados;

        let geojson = {
            'type': 'FeatureCollection',
            'features': []
        };

        
        for (let i = 1; i < this.dados.length; ++i) {
            
            if (i === 1) {
                this.segmentLatlngs = [this.dados[0].lst_localizacao];
            }
            
            this.segmentLatlngs.push(this.dados[i].lst_localizacao);
            
            this.line_width = 1;

            if (turf.inside(turf.point(dados[i].lst_localizacao), cerca)) {
                this.line_width = 20;
            }

            geojson.features.push({
                'type': 'Feature',
                'properties': {
                    'velocidade': this.dados[i].vl_velocidade,
                    'ignicao': this.dados[i].flg_ignicao,
                    'dt_gps': this.dados[i].dt_gps,
                    'desc_ativo': this.dados[i].desc_ativo,
                    'line-width': this.line_width,
                    'color': 'white'
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.segmentLatlngs
                }
            })

            this.segmentLatlngs = [this.dados[i].lst_localizacao];
        }

        return geojson;
    },
    lineOfComplete: function(geojsonLinesTalhao, dadosVeiculos) {

        for (var i in dadosVeiculos) {
            for (var j in geojsonLinesTalhao.features) {
                var pt = turf.point(dadosVeiculos[i].lst_localizacao);
                var line = turf.lineString(geojsonLinesTalhao.features[j].geometry.coordinates);
                let distancia = turf.pointToLineDistance(pt, line, {units: 'meters'});

                if (distancia < 3) {
                    if (!geojsonLinesTalhao.features[j].properties.hasOwnProperty('qtd_passou')) {
                        geojsonLinesTalhao.features[j].properties.qtd_passou = 0;
                    }

                    if (!geojsonLinesTalhao.features[j].properties.hasOwnProperty('datas_passadas')) {
                        geojsonLinesTalhao.features[j].properties.datas_passadas = [];
                    }

                    if (!geojsonLinesTalhao.features[j].properties.hasOwnProperty('total')) {
                        geojsonLinesTalhao.features[j].properties.total = geojsonLinesTalhao.features[j].geometry.coordinates.length;
                    }

                    geojsonLinesTalhao.features[j].properties.qtd_passou++
                    geojsonLinesTalhao.features[j].properties.datas_passadas.push(dadosVeiculos[i].dt_gps);

                    geojsonLinesTalhao.features[j].properties.name_talhao = j;
                    

                    if (geojsonLinesTalhao.features[j].properties.qtd_passou >= 10 || geojsonLinesTalhao.features[j].properties.qtd_passou > (geojsonLinesTalhao.features[j].geometry.coordinates.length / 2)) {
                        geojsonLinesTalhao.features[j].properties.color = 'green'
                    }
                }
            }
        }

        for (var m in geojsonLinesTalhao.features) {
            if (geojsonLinesTalhao.features[m].properties.hasOwnProperty('datas_passadas')) {
                geojsonLinesTalhao.features[m].properties.porc = (100 / geojsonLinesTalhao.features[m].geometry.coordinates.length) * geojsonLinesTalhao.features[m].properties.qtd_passou;
                console.log(geojsonLinesTalhao.features[m].properties);
            }
        }

        return geojsonLinesTalhao;
    }


}