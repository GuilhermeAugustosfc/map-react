import * as moment from 'moment'
import * as turf from "@turf/turf"

function calcColorSpeed(speed) {
    var i,
        speedThresholds = [6, 9, 13];

    for (i = 0; i < speedThresholds.length; ++i) {
        if (speed <= speedThresholds[i]) {
            return { index: i, velocidade: speed };
        }
    }
    return { index: speedThresholds.length, velocidade: speed };
}

export const consolidado = {
    tempoTrabalho: 0,
    tempoDentroCerca: 0,
    descolamento: 0, // Deslocamento
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
    resetConsolidado: function () {
        this.tempoTrabalho = 0;
        this.tempoDentroCerca = 0;
        this.descolamento = 0; // Deslocamento
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
                tempo: 'deslocamento'
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
            this.dataInicioViagem = obj.eventoAtual.dt_gps;
        }

        this.dtGpsAtualDateTime = new Date(moment(obj.eventoAtual.dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));

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
                    this.posicoesOciosas.push(obj.eventoAtual.lst_localizacao);

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
                this.descolamento += ((this.dtGpsAtualDateTime - this.ultimoEventoDeslocamento) / 1000);
                this.ultimoEventoDeslocamento = this.dtGpsAtualDateTime;
            }

            this.calcularTempo(['trabalhando', 'ocioso', 'desligado'], this.dtGpsAtualDateTime);

            if (this.ultimoEventoDentroCerca) {
                this.tempoDentroCerca += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCerca) / 1000);
                this.ultimoEventoDentroCerca = 0;
            }
        }

        this.dtFinalSeg = new Date(moment(this.dtGpsAtualDateTime, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.dtInicialSeg = new Date(moment(this.dataInicioViagem, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.tempoTrabalhoAtual = ((this.dtFinalSeg - this.dtInicialSeg) / 1000);

        this.consolidado = {
            tempoTrabalho: moment.utc(this.tempoTrabalhoAtual * 1000).format('HH:mm:ss'),
            deslocamento: moment.utc(this.descolamento * 1000).format('HH:mm:ss'),
            tempoDentroCerca: moment.utc(this.tempoDentroCerca * 1000).format('HH:mm:ss'),
            tempoDentroCercaDesligado: moment.utc(this.tempoDentroCercaDesligado * 1000).format('HH:mm:ss'),
            tempoDentroCercaOcioso: moment.utc(this.tempoDentroCercaOcioso * 1000).format('HH:mm:ss'),
            tempoDentroCercaTrabalhando: moment.utc(this.tempoDentroCercaTrabalhando * 1000).format('HH:mm:ss'),
            porcDentroCerca: parseFloat((100 * this.tempoDentroCerca) / this.tempoTrabalhoAtual),
            porcForaCerca: parseFloat((100 * this.descolamento) / this.tempoTrabalhoAtual),
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
            return {
                tempoTrabalho: "00:00:000",
                deslocamento: "00:00:00",
                tempoDentroCerca: "00:00:00",
                porcDentroCerca: 0,
                porcForaCerca: 0
            }
        }

        if (!cercaConsolidado) {
            return
        }

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

                if (this.ultimoEventoDentroCerca) {
                    this.tempoDentroCerca += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCerca) / 1000);
                    this.ultimoEventoDentroCerca = 0;
                }


                this.calcularTempo(['ocioso', 'desligado', 'trabalhando'], this.dtGpsAtualDateTime);

            }



        }

        if (this.ultimoEventoDentroCerca) {
            this.tempoDentroCerca += ((this.dtGpsAtualDateTime - this.ultimoEventoDentroCerca) / 1000);
            this.ultimoEventoDentroCerca = 0;
        }

        this.calcularTempo(['ocioso', 'desligado', 'deslocamento', 'trabalhando'], this.dtGpsAtualDateTime);


        this.dtFinalSeg = new Date(moment(dados[(dados.length - 1)].dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.dtInicialSeg = new Date(moment(dados[0].dt_gps, "DD/MM/YYYY HH:m:ss").format("YYYY-MM-DD HH:m:ss"));
        this.tempoTrabalhoAtual = ((this.dtFinalSeg - this.dtInicialSeg) / 1000);


        return {
            tempoTrabalho: moment.utc(this.tempoTrabalhoAtual * 1000).format('HH:mm:ss'),
            deslocamento: moment.utc(this.descolamento * 1000).format('HH:mm:ss'),
            tempoDentroCerca: moment.utc(this.tempoDentroCerca * 1000).format('HH:mm:ss'),
            tempoDentroCercaDesligado: moment.utc(this.tempoDentroCercaDesligado * 1000).format('HH:mm:ss'),
            tempoDentroCercaOcioso: moment.utc(this.tempoDentroCercaOcioso * 1000).format('HH:mm:ss'),
            tempoDentroCercaTrabalhando: moment.utc(this.tempoDentroCercaTrabalhando * 1000).format('HH:mm:ss'),
            porcDentroCerca: parseFloat((100 * this.tempoDentroCerca) / this.tempoTrabalhoAtual),
            porcForaCerca: parseFloat((100 * this.descolamento) / this.tempoTrabalhoAtual),
            porcDentroCercaOcioso: parseFloat((100 * this.tempoDentroCercaOcioso) / this.tempoTrabalhoAtual),
            porcDentroCercaDesligado: parseFloat((100 * this.tempoDentroCercaDesligado) / this.tempoTrabalhoAtual),
            porcDentroCercaTrabalhando: parseFloat((100 * this.tempoDentroCercaTrabalhando) / this.tempoTrabalhoAtual),
            posicoesDesligadas: this.posicoesDesligadas,
            posicoesOciosas: this.posicoesOciosas,
            posicoesDeslocamento: this.posicoesDeslocamento,
            posicoesTrabalhando: this.posicoesTrabalhando
        }
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
        { color: '#868b00' }, { color: '#00008b' }, { color: 'darkred' }, { color: 'black' }
    ],

    animacao: function (dados, map, callback) {
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
        this.indexFeature = 0;

        window.clearInterval(this.timer);

        this.map.jumpTo({ 'center': this.dados[0].lst_localizacao, 'zoom': 15 });
        this.map.setPitch(30);
        var rotaAtual = [];

        this.timer = window.setInterval(function () {

            if (this.indexInterval < this.dados.length) {
                this.optionIdx = calcColorSpeed(this.dados[this.indexInterval].vl_velocidade);

                if (this.indexInterval === 1) {
                    this.prevOptionIdx = calcColorSpeed(this.dados[0].vl_velocidade);
                    this.segmentLatlngs = [this.dados[0].lst_localizacao];
                    callback(this.dados[0]);
                }

                this.segmentLatlngs.push(this.dados[this.indexInterval].lst_localizacao);

                rotaAtual = this.map.getSource('rota')._data;
                rotaAtual.features.push({
                    'type': 'Feature',
                    'properties': {
                        'color': this.colorsSpeed[this.optionIdx.index].color,
                        'velocidade': this.optionIdx.velocidade,
                        'dt_gps': this.dados[this.indexInterval].dt_gps,
                        'desc_ativo': this.dados[this.indexInterval].desc_ativo
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': this.segmentLatlngs
                    }
                })

                this.map.getSource('rota').setData(rotaAtual)

                this.prevOptionIdx.index = this.optionIdx.index;
                this.segmentLatlngs = [this.dados[this.indexInterval].lst_localizacao]
                this.indexInterval++;

                // this.map.panTo(this.segmentLatlngs);
                callback(this.dados[this.indexInterval])

            } else {
                window.clearInterval(this.timer);
            }
        }.bind(this), 10);
    },

    resume: function (dados) {
        this.dados = dados;

        let geojson = {
            'type': 'FeatureCollection',
            'features': []
        };
        for (let i = 1; i < this.dados.length; ++i) {
            this.optionIdx = calcColorSpeed(this.dados[i].vl_velocidade);

            if (i === 1) {
                this.segmentLatlngs = [this.dados[0].lst_localizacao];
                this.prevOptionIdx = calcColorSpeed(this.dados[0].vl_velocidade);
            }

            this.segmentLatlngs.push(this.dados[i].lst_localizacao);
            geojson.features.push({
                'type': 'Feature',
                'properties': {
                    'color': this.colorsSpeed[this.optionIdx.index].color,
                    'velocidade': this.optionIdx.velocidade,
                    'dt_gps': this.dados[i].dt_gps,
                    'desc_ativo': this.dados[i].desc_ativo
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.segmentLatlngs
                }
            })

            this.prevOptionIdx.index = this.optionIdx.index;
            this.segmentLatlngs = [this.dados[i].lst_localizacao];
        }

        return geojson;
    }


}