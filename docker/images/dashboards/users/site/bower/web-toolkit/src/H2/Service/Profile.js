'use strict';

define([
    '../../vendor/lodash-2.4.1',
    './DriverLicense',
    'q'
], function(_, DriverLicenseService, Q) {

    var Service = function(api) {
        this._api = api;
    };
    
    Service.sortSchemaFields = function(fields) {
        fields = _.sortBy(fields, 'name');
        return (function getChildren(parentName) { // Group by parent
            return fields
                .filter(function(field) { return field.belongsTo == parentName; })
                .reduce(function(_fields, child) {
                    return _fields.concat([child], getChildren(child.name));
                }, []);
        })('');        
    };

    Service.prototype.getSchema = function(request) {
        return this._api.call('com.hailocab.service.profile', 'getschema', request)
            .then(function(response) {
                response.schema.fields = Service.sortSchemaFields(response.schema.fields);
                return response;
            });
    };

    /**
     * @param {Array} ids The schema IDs
     * @return {Promise} The schemas as {schemaId: schema}
     */
    Service.prototype.getSchemas = function(ids) {
        var service = this;
        var schemas = _.uniq(ids).map(function(id) {
            return service.getSchema({schemaId: id}).then(function(schema) {
                return {id: id, schema: schema};
            });
        });
        return Q.all(schemas).then(function(schemas) {
            return schemas.reduce(function(schemas, schema) {
                schemas[schema.id] = schema.schema;
                return schemas;
            }, {});
        });
    };

    return Service;
});
