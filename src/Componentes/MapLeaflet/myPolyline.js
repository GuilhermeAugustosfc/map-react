import L from 'leaflet';

var MultiOptionsPolyline = L.FeatureGroup.extend({

    initialize: function (latlngs, options) {
        var copyBaseOptions = options.multiOptions.copyBaseOptions;

        this._layers = {};
        this._options = options;
        if (copyBaseOptions === undefined || copyBaseOptions) {
            this._copyBaseOptions();
        }

        this.setLatLngs(latlngs);
    },

    _copyBaseOptions: function () {
        var multiOptions = this._options.multiOptions,
            baseOptions,
            optionsArray = multiOptions.options,
            i, len = optionsArray.length;

        baseOptions = L.extend({}, this._options);
        delete baseOptions.multiOptions;

        for (i = 0; i < len; ++i) {
            optionsArray[i] = L.extend({}, baseOptions, optionsArray[i]);
        }
    },

    setLatLngs: function (latlngs) {
        var i, len = latlngs.length,
            multiOptions = this._options.multiOptions,
            optionIdxFn = multiOptions.optionIdxFn,
            fnContext = multiOptions.fnContext || this,
            prevOptionIdx, optionIdx,
            segmentLatlngs;

        this._originalLatlngs = latlngs;

        this.eachLayer(function (layer) {
            this.removeLayer(layer);
        }, this);

        for (i = 1; i < len; ++i) {
            optionIdx = optionIdxFn.call(
                fnContext, latlngs[i], latlngs[i - 1], i, latlngs);

            if (i === 1) {
                segmentLatlngs = [latlngs[0]];
                prevOptionIdx = optionIdxFn.call(fnContext, latlngs[0], latlngs[0], 0, latlngs);
            }

            segmentLatlngs.push(latlngs[i]);

            // is there a change in options or is it the last point?
            if (prevOptionIdx !== optionIdx || i === len - 1) {
                // Check if options is a function or an array
                if (typeof multiOptions.options === "function") {
                    this.addLayer(L.polyline(segmentLatlngs, multiOptions.options(prevOptionIdx)));
                } else {
                    this.addLayer(L.polyline(segmentLatlngs, multiOptions.options[prevOptionIdx]));
                }

                prevOptionIdx = optionIdx;
                segmentLatlngs = [latlngs[i]];
            }
        }

        return this;
    },

    getLatLngs: function () {
        return this._originalLatlngs;
    },

    getLatLngsSegments: function () {
        var latlngs = [];

        this.eachLayer(function (layer) {
            latlngs.push(layer.getLatLngs());
        });

        return latlngs;
    }
});

L.MultiOptionsPolyline = MultiOptionsPolyline;
L.multiOptionsPolyline = function (latlngs, options) {
    return new MultiOptionsPolyline(latlngs, options);
};



function Demo(mapElm, multiOptionsKey) {
    this.mapElm = mapElm;
    this.selected = multiOptionsKey || 'altitude';
}

Demo.prototype = {
    constructor: Demo,

    trackPointFactory: function (data) {
        return data.map(function (item) {
            var trkpt = L.latLng(item.lst_localizacao[0], item.lst_localizacao[1]);
            return trkpt;
        });
    },

    loadData: function (latLngs) {
        var me = this;

        me.trackPoints = me.trackPointFactory(latLngs);
        me.showMapAndTrack();
    },

    showMapAndTrack: function () {
        var me = this,
            points = me.trackPoints;

        if (!me.map) {
            me.map = this.mapElm
        }

        if (me.visibleTrack) {
            me.map.removeLayer(me.visibleTrack);
        }

        me.visibleTrack = L.featureGroup();

        // create a polyline from an arrays of LatLng points
        var polyline = L.multiOptionsPolyline(points, {
            multiOptions: me._multiOptions[me.selected],
            weight: 5,
            lineCap: 'butt',
            opacity: 0.75,
            smoothFactor: 1}).addTo(me.visibleTrack);

        // zoom the map to the polyline
        me.map.fitBounds(polyline.getBounds());

        me.visibleTrack.addTo(me.map);
    },
    _multiOptions: {
        triZebra: {
            optionIdxFn: function (latLng, prevLatLng, index) {
                return Math.floor(index / 3) % 3;
            },
            options: [
                {color: '#2FFC14'},
                {color: '#FC14ED'},
                {color: '#FAE900'}
            ]
        },
        speed: {
            optionIdxFn: function (latLng, prevLatLng) {
                var i, speed,
                    speedThresholds = [30, 35, 40, 45, 50, 55, 60, 65];

                speed = latLng.speed

                for (i = 0; i < speedThresholds.length; ++i) {
                    if (speed <= speedThresholds[i]) {
                        return i;
                    }
                }
                return speedThresholds.length;
            },
            options: [
                {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
            ]
        },
        altitude: {
            optionIdxFn: function (latLng) {
                var i, alt = latLng.alt,
                    altThresholds = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500]; // meters

                if (!alt) {
                    return 0;
                }

                for (i = 0; i < altThresholds.length; ++i) {
                    if (alt <= altThresholds[i]) {
                        return i;
                    }
                }
                return altThresholds.length;
            },
            options: [
                {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
            ]
        },
    }
}

export default Demo;
