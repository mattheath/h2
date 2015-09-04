'use strict';

define(function () {

  /**
   * The hob service (see https://github.com/hailocab/hob-service)
   *
   * @param {web-toolkit/H2/CallAPI} api
   */
  var Service = function (api) {
    this._api = api;
  };

  /**
   * @returns {Array} A list of hobs available
   */
  Service.prototype.getHobs = function (request) {
    return this._api
      .call('com.hailocab.service.hob', 'list', request || {})
      .then(function(response) {
        // fallback to an empty array if hobs does not exist
        var hobs = response.hobs || [];

        return hobs;
      });
  };

  /**
   *
   * @param hob
   * @returns {*} The hob config object for the supplied hob
   */
  Service.prototype.getHobConfig = function(hob){
    return this._api
      .call("com.hailocab.service.hob", "config", {code: hob})
      .then(function(hConfig){
        return hConfig;
      });

  };

  return Service;
});
