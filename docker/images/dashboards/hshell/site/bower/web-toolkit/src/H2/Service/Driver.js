'use strict';

define([
    '../../vendor/lodash-2.4.1',
    './Profile',
    'q'
], function(_, ProfileService, Q) {

    /**
     * @param {H2/CallAPI} api
     */
    var Service = function(api) {
        this._api = api;
    };

    /**
     * @param {Object|string} request The endpoint request or a driver ID
     * @return {Promise}
     */
    Service.prototype.read = function(request) {
        if (!(request instanceof Object)) request = {id: request};
        var schema = this.getSchema(request.id);
        return this._call('read', request).then(function(response) {
            response.driver.id = request.id; // It's not provided
            return schema.then(function(schema) {
                response.driver.profile = response.driver.profile.filter(function(field) {
                    // Ignore fields not in the schema
                    // TODO Move it to the service?
                    return schema.fields.some(function(schemaField) {
                        return schemaField.name == field.name;
                    });
                });
                return response;
            });
        });
    };

    /**
     * @param {Array} ids The driver IDs
     * @return {Promise} An array of drivers
     */
    Service.prototype.getMany = function(ids) {
        var service = this;
        return Q.all(_.uniq(ids).map(function(id) {
            return service.read({id: id}).then(function(response) {
                var driver = response.driver;
                driver.id = id;
                return driver;
            });
        }));
    };

    /**
     * @param {Object} request
     * @return {Promise}
     */
    Service.prototype.search = function(request) {
        return this._call('search', request).then(function(response) {
            response.drivers = response.drivers || [];
            return response;
        });
    };

    /**
     * @param {Object|string} request The endpoint request or a driver ID
     * @return {Promise}
     */
    Service.prototype.getLicenses = function(request) {
        if (!(request instanceof Object)) request = {driverId: request};
        return this._call('getlicenses', request).then(function(response) {
            response.licenses = response.licenses || [];
            return response;
        });
    };

    /**
     * @param {string} id The driver ID
     * @return {Promise}
     */
    Service.prototype.getSchema = function(id) {
        if (id.length <= 3) {
            throw new Error("getSchema expects driver id and not a hob: " + id);
        }
        return this._call('getschema', {driverId: id})
            .then(function(response) {
                response.schema.fields = ProfileService.sortSchemaFields(response.schema.fields);
                return response.schema;
            });
    };

    /**
     * @param {Object} request
     * @return {Promise}
     */
    Service.prototype.update = function(request) {
        return this._call('update', request);
    };

    /**
     * @param {Object} params
     * @param {string} params.ids The changes IDs
     * @param {string} params.action Either 'approve' or 'reject'
     * @param {string} [params.comment]
     * @return {Promise}
     */
    Service.prototype.moderateChanges = function(params) {
        return this._api.call('com.hailocab.service.driver', params.action + 'change', {
            changeIds: params.ids,
            moderatorId: this._api.getSession().getUsername(), // TODO Shouldn't this be in the service?
            comment: params.comment
        });
    };

    /**
     * @param {Object|string} request The request or the HOB
     * @returns {Promise} As {drivers: [{driverId, changes: []}], schema}
     */
    Service.prototype.getPendingChanges = function(request) {
        var service = this;
        request = typeof request == 'string' ? {hob: request} : request;
        return this._api
            .call('com.hailocab.service.driver', 'getpendingchanges', request)
            .then(function (response) {
                response.drivers = (response.drivers || [])
                    .map(function(driver) {
                        driver.changes = service._removeChangesNotInSchema(
                            driver.changes,
                            response.schema
                        );
                        return driver;
                    })
                    // Make sure every driver has a single entry in params.changes.drivers
                    // TODO Do it in the backend?
                    .reduce(function(drivers, driver) {
                        var existingDriver = _.find(drivers, function(_driver) {
                            return _driver.driverId == driver.driverId;
                        });
                        if (existingDriver) {
                            existingDriver.changes = existingDriver.changes.concat(driver.changes);
                        } else {
                            drivers.push(driver);
                        }
                        return drivers;
                    }, [])
                    .filter(function(driver) { return driver.changes.length; });
                return response;
            });
    };

    Service.prototype._removeChangesNotInSchema = function(changes, schema) {
        return changes.filter(function(change) {
            return schema.fields.some(function(field) {
                return field.name == change.newField.name;
            });
        });
    };

    Service.prototype._call = function(endpoint, request) {
        return this._api.call('com.hailocab.service.driver', endpoint, request);
    };

    Service.prototype._getHob = function(driverId) {
        // TODO Is this the best approach?
        var matches = driverId.match(/^[A-Z]{3}/);
        if (!matches) throw new Error("Unknown driver ID format for '" + driverId + "'");
        return matches[0];
    };

    return Service;
});
