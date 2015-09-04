// HailoMap -- just a Leaflet.js wrapper
define([
    'underscore',    
    'leaflet'
], function(_, L) {

    // console.log('under', _);

 var mapBoxSettings = {
        "user": "hailocabs",
        "maps": {
            "default": "g9mb2ka2"
        }
    };

    
    var mapBoxMap = {
        user: mapBoxSettings.user,
        map: mapBoxSettings.maps['default']
    };
    //Setting up the mapbox tiles
    L.TileLayer.Common = L.TileLayer.extend({
        initialize: function (options) {
            L.TileLayer.prototype.initialize.call(this, this.url, options);
        }
    });
    L.TileLayer.MapBox = L.TileLayer.Common.extend({
        url: 'http://{s}.tiles.mapbox.com/v3/{user}.{map}/{z}/{x}/{y}.png'
    });

    // markers 
    var predefinedMarkers = {
        'cars' : {
            24 : {
                'options': {
                    iconSize: [24,24],
                    iconAnchor: [12,12],
                    popupAnchor:  [0, -12]
                },
                'icons': {
                    'black': {
                        iconUrl: '/img/markers/car-24-black@2x.png'
                    },
                    'blue': {
                        iconUrl: '/img/markers/car-24-blue@2x.png'
                    },
                    'darkBlue': {
                        iconUrl: '/img/markers/car-24-dark-blue@2x.png'
                    },
                    'purple': {
                        iconUrl: '/img/markers/car-24-purple@2x.png'
                    },
                    'red': {
                        iconUrl: '/img/markers/car-24-red@2x.png'
                    },
                    'orange': {
                        iconUrl: '/img/markers/car-24-orange@2x.png'
                    },
                    'pink': {
                        iconUrl: '/img/markers/car-24-pink@2x.png'
                    },
                    'yellow': {
                        iconUrl: '/img/markers/car-24-yellow@2x.png'
                    },
                    'green': {
                        iconUrl: '/img/markers/car-24-green@2x.png'
                    },
                    'grey': {
                        iconUrl: '/img/markers/car-24-grey@2x.png'
                    }
                }
            },
            18 : {
                'options': {
                    iconSize: [18,18],
                    iconAnchor: [9,9],
                    popupAnchor:  [0, -9]
                },
                'icons': {
                    'black': {
                        iconUrl: '/img/markers/car-18-black@2x.png'
                    },
                    'blue': {
                        iconUrl: '/img/markers/car-18-blue@2x.png'
                    },
                    'darkBlue': {
                        iconUrl: '/img/markers/car-18-dark-blue@2x.png'
                    },
                    'purple': {
                        iconUrl: '/img/markers/car-18-purple@2x.png'
                    },
                    'red': {
                        iconUrl: '/img/markers/car-18-red@2x.png'
                    },
                    'orange': {
                        iconUrl: '/img/markers/car-18-orange@2x.png'
                    },
                    'pink': {
                        iconUrl: '/img/markers/car-18-pink@2x.png'
                    },
                    'yellow': {
                        iconUrl: '/img/markers/car-18-yellow@2x.png'
                    },
                    'green': {
                        iconUrl: '/img/markers/car-18-green@2x.png'
                    },
                    'grey': {
                        iconUrl: '/img/markers/car-18-grey@2x.png'
                    }
                }
            }
        },
        'markers': {
            24: {
                'options': {
                    iconSize: [24,24],
                    iconAnchor: [12,24],
                    popupAnchor:  [0, -24]
                },
                'icons': {
                    'black': {
                        iconUrl: '/img/markers/marker-24-black@2x.png'
                    },
                    'blue': {
                        iconUrl: '/img/markers/marker-24-blue@2x.png'
                    },
                    'darkBlue': {
                        iconUrl: '/img/markers/marker-24-dark-blue@2x.png'
                    },
                    'purple': {
                        iconUrl: '/img/markers/marker-24-purple@2x.png'
                    },
                    'red': {
                        iconUrl: '/img/markers/marker-24-red@2x.png'
                    },
                    'orange': {
                        iconUrl: '/img/markers/marker-24-orange@2x.png'
                    },
                    'pink': {
                        iconUrl: '/img/markers/marker-24-pink@2x.png'
                    },
                    'yellow': {
                        iconUrl: '/img/markers/marker-24-yellow@2x.png'
                    },
                    'green': {
                        iconUrl: '/img/markers/marker-24-green@2x.png'
                    },
                    'grey': {
                        iconUrl: '/img/markers/marker-24-grey@2x.png'
                    }
                }
            }
        }
    };

    var defaultOptions = {
        'markerIcons': {
            'style': 'markers',
            'size': 24,
            'colourMapping': {}
        },
        'leaflet' : {
            'attributionControl': false,
            'zoomControl': false,
            'scrollWheelZoom': true,
            'tap': false
        }
    };

    // Create a HailoMap
    var HailoMap = function (attr) {
        if (!attr.id) return;
        var that = this;
        var tiles;
        this.options = _.defaults(attr || {}, defaultOptions),

        this.map = L.map(this.options.id, this.options.leaflet);
        this.layerGroupsForType = {};
        this.markersOnLayerGroups = {};
        this.setMarkerIconMapping(
            this.options.markerIcons.style,
            this.options.markerIcons.size,
            this.options.markerIcons.colourMapping
        );
        tiles = new L.TileLayer.MapBox(mapBoxMap);
        tiles.addTo(this.map);

        if (this.options.fullscreen) {
            fullscreenButton.init(this.map);
        }
    };

    // style and size have to refer to one of the predefined markers
    HailoMap.prototype.setMarkerIconMapping = function(style, size, colourMapping) {
        var marker = predefinedMarkers[style][size];
        var markerIconMappingDefinition = {};
        if (!_.isEmpty(colourMapping)) {
            _.each(colourMapping, function(val, key) {
                markerIconMappingDefinition[key] = marker.icons[val];
            });
        }
        var markerIconMapping = {};
        for (var miKey in markerIconMappingDefinition) {
            if (markerIconMappingDefinition.hasOwnProperty(miKey)) {
                var markerIconDefinition = markerIconMappingDefinition[miKey];
                var Icon = L.Icon.extend({
                    options : marker.options
                });
                markerIconMapping[miKey] = new Icon(markerIconDefinition);
            }
        }
        this.markerIconMapping = markerIconMapping;
    };

    HailoMap.prototype.markers = [];
    HailoMap.prototype.getMarkers = function () {
        return this.markers;
    };

    HailoMap.prototype.redrawMarkers = function (markers, attr) {
        var that = this,
            layerGroupsForType = this.layerGroupsForType,
            markersOnLayerGroups = this.markersOnLayerGroups,
            map = this.map,
            markerIconMapping = this.markerIconMapping,
            latLngs = [],
            groupedMarkers = {},
            options = attr || {};

        var generateMarker = function (markerDef) {
            var originalOnAdd = L.Marker.prototype.onAdd,
                originalOnRemove = L.Marker.prototype.onRemove;
            
            var markerOptions; 
            if (markerIconMapping[markerDef.type]) {
                var iconType = markerDef.type;
                if ('iconType' in markerDef) iconType = markerDef.iconType;
                markerOptions = { icon: markerIconMapping[iconType] };
            }

            var marker = L.marker(
                [ markerDef.lat, markerDef.lng ],
                markerOptions
            ).bindPopup(markerDef.content);

            marker.onAdd = function (map) {
                originalOnAdd.call(this, map);
                $(this._icon).hide().fadeIn();
            };
            marker.onRemove = function (map) {
                $(this._icon).fadeOut();
                originalOnRemove.call(this, map);
            };

            // marker.on('mouseover', function(e){
            //         marker.openPopup();
            // });
            // marker.on('mouseout', function(e){
            //         marker.closePopup();
            // });

            return marker;
        };

        if (markers.length) {
            if ('fitBounds' in options && options.fitBounds) {
                latLngs = _.map(markers, function (m) { return new L.LatLng(m.lat, m.lng); });
                map.fitBounds(latLngs, options);
            }

            groupedMarkers = _.groupBy(markers, function (m) {
                return m.type;
            });

            _.each(groupedMarkers, function (markerDefinitionList, type) {
                if (!layerGroupsForType[type]) {
                    layerGroupsForType[type] = L.layerGroup();
                }

                // Given a list of markers, we need to generate Marker objects and insert them to their typed
                // layer group.
                _.each(markerDefinitionList, function (markerDef) {
                    // However:
                    //   - If they already exist they should not be created.
                    var markerExists = (markerDef.markerId in markersOnLayerGroups);
                    if (!markerExists) { // Aghast, no marker!
                        var marker = generateMarker(markerDef);
                        layerGroupsForType[type].addLayer(marker);
                        
                        markersOnLayerGroups[markerDef.markerId] = {
                            leafletLayerId: marker._leaflet_id,
                            type: markerDef.type,
                            lat: markerDef.lat,
                            lng: markerDef.lng
                        };
                        that.markers.push(marker);
                    } else if (markerExists && (markersOnLayerGroups[markerDef.markerId].lat != markerDef.lat ||
                                                markersOnLayerGroups[markerDef.markerId].lng != markerDef.lng)) { // Marker exists; location changed.
                        var leafletLayerId = markersOnLayerGroups[markerDef.markerId].leafletLayerId;

                        layerGroupsForType[type].getLayer(leafletLayerId).setLatLng([markerDef.lat, markerDef.lng]).update();

                        markersOnLayerGroups[markerDef.markerId].lat = markerDef.lat;
                        markersOnLayerGroups[markerDef.markerId].lng = markerDef.lng;
                    }

                    // reset the retries count
                    delete markersOnLayerGroups[markerDef.markerId].retries;
                });

                layerGroupsForType[type].addTo(map);              
            });

            // Clear dead markers
            var maxRetries = 10; // no. of times an ID can be absent from set before we delete
            var markerIds = _.pluck(markers, 'markerId');
            _.each(markersOnLayerGroups, function (markerObject, markerDefId) {
                // If markers exist in the layers group which are not in this new list
                // we should remove from the layers group and their trace from the hash.
                if (markerIds.indexOf(markerDefId) === -1) {
                    if (markerObject.retries && markerObject.retries > maxRetries) {
                        // delete the marker
                        var leafletLayerId = markerObject.leafletLayerId;
                        var type = markerObject.type;
                        layerGroupsForType[type].removeLayer(leafletLayerId);
                        delete markersOnLayerGroups[markerDefId];
                    } else {
                        markerObject.retries = markerObject.retries ? markerObject.retries + 1 : 1;
                    }
                }
            });
        }
    };

    HailoMap.prototype.addMarkers = HailoMap.prototype.redrawMarkers;

    HailoMap.prototype.getMap = function() {
        return this.map;
    };

    HailoMap.prototype.getCenter = function() {
        var center = this.map.getCenter();
        return {
            lat: center.lat,
            lng: center.lng
        };
    };

    HailoMap.prototype.getRadiusOfMap = function() {
        var mapBoundNorthEast = this.map.getBounds().getNorthEast();
        return mapBoundNorthEast.distanceTo(this.map.getCenter());
    };

    HailoMap.prototype.remove = function() {
        return this.map.remove();
    };

    // Zoom the map to show the whole world
    HailoMap.prototype.showWorld = function() {
        this.map.setView([38.82259, -2.8125], 1)
    };

    HailoMap.prototype.openMarkerAtLocation = function(loc) {
        _.each(this.getMarkers(), function(m) {
            if (m.getLatLng().equals(L.latLng(loc.lat, loc.lng))) {
                m.openPopup();
            }
        });
    };

    HailoMap.prototype.highlightLocation = function(loc) {
        // TODO show a pulse on the map at loc
    };

    HailoMap.prototype.addPolyLine = function(latlngs) {
        var polyLineOpts = {
            color: '#F33900', // red
            weight: 3
        }
        var polyline = L.polyline(latlngs, polyLineOpts).addTo(this.map);
        this.map.fitBounds(polyline.getBounds());
    };

    // Fullscreen map button behaviour
    var fullscreenButton = {
        setIcon: function(isFullscreen, $icon) {
            if (isFullscreen) {
                var className = 'ion-arrow-shrink';
            } else {
                var className = 'ion-arrow-expand';
            }
            $icon.attr('class', className);
        },
        
        setFullscreen:  function(isFullscreen, map) {
            var $mapContainer = $(map._container),
                $icon = $('.fullscreen-toggle i', $mapContainer);

            $mapContainer.toggleClass('fullscreen');
            this.setIcon(isFullscreen, $icon);

            // scroll to the top of #main
            if (isFullscreen) {
                this.mainScrollPosition = $('#main').scrollTop();
                $('#main').scrollTop(0);
            } else if (this.mainScrollPosition) {
                $('#main').scrollTop(this.mainScrollPosition);
            }

            map.invalidateSize(); // refresh map
            map.options.tap = isFullscreen; // enable tap in fullscreen
        },

        init: function(map) {
            var that = this,
                isFullscreen = false,
                label = L.control();

            label.onAdd = function (m) {
                this._div = L.DomUtil.create('div', 'fullscreen-toggle');
                this.update('Fullscreen toggle');
                L.DomEvent
                    .addListener(this._div, 'click', L.DomEvent.stopPropagation)
                    .addListener(this._div, 'click', L.DomEvent.preventDefault)
                    .addListener(this._div, 'click', function () {
                        isFullscreen = !isFullscreen;
                        that.setFullscreen(isFullscreen, map);
                    });
                return this._div;
            };
            label.update = function (text) {
                this._div.innerHTML =
                    '<a href="#"><i class="ion-arrow-expand"></i></a>';
            };
            label.addTo(map);
        }
    };

    return HailoMap;
});