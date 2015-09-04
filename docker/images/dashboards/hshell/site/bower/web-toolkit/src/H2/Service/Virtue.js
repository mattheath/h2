'use strict';

define([
  '../../vendor/lodash-2.4.1',
  'q',
  '../../Environment'
], function(_, Q, Environment){

  var defaultOpts = {
    retry  : 5000,  // milliseconds to reconnect
    host   : false, // set to override virtue hostname
    port   : 443,
    secure : true,  // use SSL (WSS)
    auth   : true,  // automatically authenticate to H2
    debug  : false,  // log debug messages to console
    region : "",   // The region to connect to
    reconnect: true // by default we allow reconnection
  };

  var virtueURLs = {
    'tst'    : 'virtue-tst.elasticride.com',
    'stg'    : 'virtue-stg.elasticride.com',
    'live'   : 'virtue-lve.elasticride.com',
    'lve'    : 'virtue-lve.elasticride.com'
  };

  /**
   * console.log wrapper
   */
  function log() {
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    if (console){
      console.log(Array.prototype.slice.call(arguments));
    }
  };

  /**
   * @param {H2/CallAPI} api
   * @param string region
   * @return string The virtue URL for the api environment
   */
  function getVirtueURL(api, region) {
    var env = Environment.fromApiUrl(api.getBaseURL()).toString();
    var url = (env in virtueURLs) ? virtueURLs[env] : virtueURLs['tst'];
    // Now use the region override to specifically connect to our virtue instance
    if (region){
      // e.g. virtue-eu-west-1-lve.elasticride.com
      url = url.replace("-", "-" + region + "-") ;
    }
    return url;
  };

  /**
   * @param {H2/Service/Virtue} virtue
   */
  function doConnect(virtue) {
    virtue.conn = new WebSocket(virtue.connectStr);

    // Handling critical close event on socket
    virtue.conn.onclose = function(evt){
      if (virtue.closeHandler) {
        virtue.closeHandler(evt);
      }

      if(virtue.opts.reconnect){
        virtue.log(
          '[Virtue-Client] Connection closed. Reconnection in '
            + virtue.opts.retry + ' [url=' + virtue.connectStr + ']'
        );
        setTimeout(doConnect, virtue.opts.retry, virtue);
      }
    };

    // Now handling legit messages
    virtue.conn.onmessage = function(evt){
      var msg = JSON.parse(evt.data);

      // Every message from virtue has an action field
      if (virtue.msgHandlers[msg.action]) {
        _.each(virtue.msgHandlers[msg.action], function(handler) {
          handler(msg.action, msg);
        });
      } else {
        // No handler for this message - just log it then
        virtue.log('[Virtue-Client] No handler for message [action='
          + msg.action + ', message=' + msg + ']');
      }
    }
  }

  /**
   * @param {H2/CallAPI} api
   * @param object attr Options -- see defaultOpts
   */
  var Virtue = function(api, attr) {
    if (!window['WebSocket']) {
      throw new Error('Websockets are not supported in your browser.');
    }

    this._api = api;
    this.opts = _.defaults(attr || {}, defaultOpts);
    this.msgHandlers = {};

    if (this.opts.auth) { this.authenticate(); }
  };

  Virtue.prototype.authenticate = function() {
    var that = this;
    var sessionId = this._api.getSession().getId();
    if (sessionId) {
      this.addMsgHandler('auth', function() {
        that.send({ action: 'auth', sessionId: sessionId });
      });
      if (this.opts.debug) {
        this.addMsgHandler('auth-success', function() {
          that.log('[Virtue-Client] Authenticated!');
        });
        this.addMsgHandler('auth-failure', function() {
          that.log('[Virtue-Client] Authentication failed');
        });
      }
    }
  };

  /**
   * Adds a function handler for message identified by their action
   *
   * @param string action the message action
   * @param function handler callback
   */
  Virtue.prototype.addMsgHandler = function(action, handler) {
    if (this.msgHandlers[action]) {
      this.msgHandlers[action].push(handler);
    } else {
      this.msgHandlers[action] = [handler];
    }
  };

  /**
   * Registers a special handler that will be invoked when the
   * connection closes
   *
   * @param function closeHandler the handler to invoke upon connection close
   */
  Virtue.prototype.onClose = function(closeHandler) {
    this.closeHandler = closeHandler;
  };

  /**
   * Sends a message to virtue
   *
   * @param string msg
   */
  Virtue.prototype.send = function(msg) {
    // We can only send strings at the moment via the websockets API
    if (typeof msg === 'string') {
      this.conn.send(msg);
    } else {
      this.conn.send(JSON.stringify(msg));
    }
  };

  Virtue.prototype.updateRegion = function(newRegion){
    if(newRegion && this.opts.region !== newRegion){
      this.opts.region = newRegion;
      var host = this.opts.host ? this.opts.host : getVirtueURL(this._api, this.opts.region);
      this.connectStr = (this.opts.secure ? 'wss://' : 'ws://')
        + host + ':' + this.opts.port;
      this.log('[Virtue-Client] Switching to different region [new-region= ' + newRegion  + ']: '
        + this.connectStr);

      // To switch to a new region, we need to force a 'close' on the websocket connection
      if(this.conn){
        // code 1000 means it is a normal closure
        this.conn.close(1000);
      }
    }
  };

  Virtue.prototype.connect = function() {
    var host = this.opts.host ? this.opts.host : getVirtueURL(this._api, this.opts.region);
    this.connectStr = (this.opts.secure ? 'wss://' : 'ws://')
      + host + ':' + this.opts.port;
    this.log('[Virtue-Client] Connecting to virtue web sockets server: '
      + this.connectStr);
    doConnect(this);
  };

  Virtue.prototype.log = function() {
    if (this.opts.debug) { log.apply(this, arguments); }
  };

  return Virtue;
});
