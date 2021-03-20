
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
    tempoTrabalho: "00:00:00",
    tempoTrabalhoEfetivo: "00:00:00",
    tempoDentroCerca: "00:00:00",
    tempoForaCerca: "00:00:00", // Deslocamento
    tempoDentroCercaTrabalhando: "00:00:00", // Velocidade > 0
    tempoDentroCercaOcioso: "00:00:00", // ignição = 1 Velocidade = 0
    tempoDentroCercaDesligado: "00:00:00", // ignição = 0
    consolidarRealTime: function (dados, index) { // RETORNAR O CONSOLIDADO A CADA MOMENTO

    },
    consolidarTodosDados: function (dados) {

    }
}


export const formatLineInMap = {
    map: null,
    dados: [],
    indexInterval: 1,
    indexFeature: 0,
    posAtual: [],
    rotaAtual: [],
    prevOptionIdx: null,
    optionIdx: null,
    segmentLatlngs: null,
    timer: null,
    colorsSpeed: [
        { color: 'yellow' }, { color: '#0040FF' }, { color: 'red' },
        // { color: '#0000FF' }, { color: '#0040FF' }, { color: '#0080FF' },
        { color: '#00FFB0' }, { color: '#00E000' }, { color: '#80FF00' },
        { color: '#FFFF00' }, { color: '#FFC000' }, { color: '#FF0000' }
    ],

    animacao: function (dados, map, callback) {
        this.map = map;
        this.dados = dados;
        this.indexInterval = 1;
        this.indexFeature = 0;

        window.clearInterval(this.timer);

        this.map.jumpTo({ 'center': this.dados[0].lst_localizacao, 'zoom': 15 });
        this.map.setPitch(30);
        var coordenadaAtual = [];
        var rotaAtual = [];

        this.timer = window.setInterval(function () {

            if (this.indexInterval < this.dados.length) {

                this.optionIdx = calcColorSpeed(this.dados[this.indexInterval].vl_velocidade);

                if (this.indexInterval === 1) {
                    this.prevOptionIdx = calcColorSpeed(this.dados[0].vl_velocidade);
                }

                this.segmentLatlngs = this.dados[this.indexInterval].lst_localizacao;

                rotaAtual = this.map.getSource('rota')._data;
                if (this.prevOptionIdx.index !== this.optionIdx.index || this.indexInterval === this.dados.length - 1) {
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
                            'coordinates': [this.dados[this.indexInterval - 1].lst_localizacao, this.segmentLatlngs]
                        }
                    })

                    map.getSource('rota').setData(rotaAtual)

                    this.prevOptionIdx.index = this.optionIdx.index;
                    this.indexFeature++;
                    this.indexInterval++;

                } else {
                    rotaAtual.features = Object.values(rotaAtual.features);
                    coordenadaAtual = rotaAtual.features.length > 0 ? rotaAtual.features[this.indexFeature].geometry.coordinates : [];

                    rotaAtual.features[this.indexFeature] = {
                        'type': 'Feature',
                        'properties': {
                            'color': this.colorsSpeed[this.optionIdx.index].color,
                            'velocidade': this.optionIdx.velocidade,
                            'dt_gps': dados[this.indexInterval].dt_gps,
                            'desc_ativo': dados[this.indexInterval].desc_ativo
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [...coordenadaAtual, this.segmentLatlngs]
                        }
                    }

                    this.map.getSource('rota').setData(rotaAtual);
                    this.indexInterval++
                }
                this.map.panTo(this.segmentLatlngs);
                callback(this.segmentLatlngs)

            } else {
                window.clearInterval(this.timer);
            }
        }.bind(this), 20);
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

            if (this.prevOptionIdx.index !== this.optionIdx.index || i === this.dados.length - 1) {
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
        }

        return geojson;
    }


}