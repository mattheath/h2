'use strict';

define([
    '../../Warning',
    './IDGen',
    'q'
], function(
    Warning,
    IDGenService,
    Q
) {
    /**
     * Interface to https://github.com/hailocab/zoning-service
     *
     * @param {H2/CallAPI} api
     */
    var Zoning = function (api) {
        this._api = api;
    };
    
    Zoning.prototype.read = function (request) {
        return this._call('read', request).then(function(response) {
            var errors = [];

            response.zone = (response.zone || []).map(function(zone) {
                try {
                    var geoData = JSON.parse(zone.geoData);
                    if (!geoData) throw new Error;
                    if (!geoData.type) {
                        // See http://geojson.org/geojson-spec.html#geojson-objects
                        // TODO Use Leaflet.geoJson() to validate it properly?
                        throw new Error; 
                    }
                    zone.geoData = geoData;
                } catch (error) {
                    errors.push(new Error(
                        'Could not parse geo data for zone \'' + zone.name +
                            '\' from \'' + zone.geoData + '\'. '
                    ));
                    zone.geoData = null;
                }

                try {
                    zone.metaData = JSON.parse(zone.metaData);
                } catch (error) {
                    errors.push(new Error(
                        'Could not parse metadata for zone \'' + zone.name +
                        '\' from \'' + zone.metaData + '\'. '
                    ));
                    zone.metaData = {};
                }

                return zone;
            });

            if (errors.length) {
                throw new Warning({
                    data: response, 
                    error: new Error(errors.join(' / '))
                });
            }

            return response;
        });
    };
    
    /**
     * Search for all zones with matching filters, with optional geodata.
     */
    Zoning.prototype.search = function (filtersList, geoData) {
        var request = {
            filters: filtersList,
            geodata: geoData
        };
        
        return this._call('search', request).then(function(response) {
            var errors = [];

            response.zones = (response.zones || []).map(function(zone) {
                try {
                    var geoData = JSON.parse(zone.geoData);
                    if (!geoData) throw new Error;
                    if (!geoData.type) {
                        // See http://geojson.org/geojson-spec.html#geojson-objects
                        // TODO Use Leaflet.geoJson() to validate it properly?
                        throw new Error; 
                    }
                    zone.geoData = geoData;
                } catch (error) {
                    errors.push(new Error(
                        'Could not parse geo data for zone \'' + zone.name +
                            '\' from \'' + zone.geoData + '\'. '
                    ));
                    zone.geoData = null;
                }

                try {
                    zone.metaData = JSON.parse(zone.metaData);
                } catch (error) {
                    errors.push(new Error(
                        'Could not parse metadata for zone \'' + zone.name +
                        '\' from \'' + zone.metaData + '\'. '
                    ));
                    zone.metaData = {};
                }

                return zone;
            });

            if (errors.length) {
                throw new Warning({
                    data: response, 
                    error: new Error(errors.join(' / '))
                });
            }

            return response;
        });
    };

    /**
     * Creates a zone. If the supplied zone does not have an ID we will create
     * one before sending our request. No object is returned upon success.
     */
    Zoning.prototype.create = function(zone){
      var service = this;
      return Q()
            .then(function(){
                if(!zone.id){
                    return new IDGenService(service._api).cruftflake()
                        .then(function(response){
                            // Generating a cruftflake ID and assigning it to our zone
                            zone.id = response.id;
                        });
                }
            })
            .then(function(){
                return service._call("create", {
                    id: zone.id,
                    name: zone.name,
                    description: zone.description,
                    tags: zone.tags,
                    metaData: JSON.stringify(zone.metaData),
                    structuredMetaData: zone.structuredMetaData || [],
                    geoData: JSON.stringify(zone.geoData)
                });                               
            });
    };


    /**
     * Updates an already existing zone.  No object is returned upon success.      
     */
     Zoning.prototype.update = function(zone){
        return this._call("update", {
            id: zone.id,
            name: zone.name,
            description: zone.description,
            tags: zone.tags,
            metaData: JSON.stringify(zone.metaData),
            structuredMetaData: zone.structuredMetaData || [],
            geoData: JSON.stringify(zone.geoData)
        });
     };


    /**
     * Creates or updates a zone depending on the value of the 'create' flag. If we are creating a zone,
     * and the supplied params object has no id, we will generate one
     */
    Zoning.prototype.save = function(params) {
        var service = this;
        var endpoint = params.id ? 'update' : 'create';
        return Q()
            .then(function() {
                if (endpoint == 'create') {
                    return new IDGenService(service._api).cruftflake()
                        .then(function(response) { params.id = response.id; });
                }
            })
            .then(function() {
                return service._call(endpoint, {
                    id: params.id,
                    name: params.name,
                    description: params.description,
                    tags: params.tags,
                    metaData: JSON.stringify(params.metaData),
                    structuredMetaData: params.structuredMetaData,
                    geoData: JSON.stringify(params.geoData)
                });
            })
            .then(function() { return params.id; });
    };

    Zoning.prototype.delete = function(request) {
        return this._call('delete', request);
    };

    Zoning.prototype._call = function (endpoint, request) {
        return this._api.call('com.hailocab.service.zoning', endpoint, request);
    };

    return Zoning;
});
