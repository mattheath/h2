'use strict';

requirejs.config({
  baseUrl: '/bower',
  shim: {
    'jquery.terminal': {
      deps: ['jquery']
    },
    'js-base64': {
      exports: 'Base64'
    }
  },
  paths: {
    jquery: 'jquery/jquery',
    'jquery.terminal': 'jquery.terminal/js/jquery.terminal-0.8.8',
    'protobuf': 'protobuf/dist/ProtoBuf',
    'ByteBuffer': 'bytebuffer/dist/ByteBufferAB',
    'Long': 'long/dist/Long',
    q: 'q/q',
    uri: 'uri.js/src',
    'js-base64': 'js-base64/base64',
    'web-toolkit': 'web-toolkit/src'
  }
});

define(['web-toolkit/Webapp', 'jquery', 'jquery.terminal', 'protobuf', 'q', 'js-base64'], function(Webapp, jQuery, term, ProtoBuf, Q, Base64) {

var getEnvironment = function() {
  return environment;
}

var getPrompt = function(service) {
  var prompt = '';
  if(service) {
    prompt = service;
  }
  var env = getEnvironment();
  if (env) {
    prompt += '#' + env.toUpperCase();
  }
  prompt += '> ';
  return prompt;
}

var getTimeNow = function() {
  return window.performance.now() || new Date().getTime();
}

var Execute = function(service, endpoint, request) {
  return app.api.call(service, endpoint, request);
}

var GetServices = function(req) {
  return Execute('com.hailocab.service.gateway', 'discoveredservices', req);
}

var GetRunningServicesClasses = function(service) {
  return Execute('com.hailocab.service.gateway', 'provisioned', {serviceName: service}).then(function(data){
    var machines = {};
    data.results.forEach(function(result){
      if (!machines[result.serviceName]) {
        machines[result.serviceName] = [];
      }
      machines[result.serviceName].push({version: result.serviceVersion, class: result.machineClass});
    });
    return machines;
  });
}

var FetchServicesList = function() {
  var cb = function(data){
    for(var i in data.services) {
      services[ data.services[i].name ] = data.services[i];
    }

  };
  
  GetServices({}).then(cb, function(err){
    console.log(err);
  });
}

var GetEndpointName = function(service, endpoint) {
  return endpoint.substr(service.length + 1);
}

var GetEndpoints = function(term, service) {
  var cb = function(response){
    if (!endpoints[service]) {
      // Setting endpoints 
      endpoints[ service ] = {};
    }

    // Get info about all endpoints
    for (var i in response.endpoints) {
      var name = GetEndpointName(service, response.endpoints[i].fqName)
      if (!endpoints[service][name]) {
        endpoints[ service ][ name ] = {info: response.endpoints[i]};
      }
    }

    // Check if we have all protos for them
    var doLoadProto = false;
    for (var name in filterEndpointsForProto(endpoints[service])) {
      // If any endpoint is missing a proto file
      // Try to load proto again
      if (!endpoints[service][name]['proto']) {
        doLoadProto = true;
      }
    }

    var token = getGithubToken();
    if (!token) {
      console.log("Create a github application token to get proto completion.\nUsage: localStorage.setItem('githubToken', 'mytoken');");
      // No point in loading the proto as githubToken is not set
      doLoadProto = false;
    }

    if (!doLoadProto) {
      // Make sure we unblock the terminal
      term.resume();
    } else {
      // Trying to get commit hash of the running version
      var commit;
      term.echo(color('Checking commit hash of running version', "#00EE11"));
      // Getting the version commit hash for loading the proto
      GetBuildVersions(service, services[service]['version']).then(function(data){
        commit = getCommitHash(data.SourceURL);
        if (commit == "") {
          throw new Error("Unable to get commit hash of running version");
        }
        return commit;
      }).fail(function(err){
        var msg;
        switch(err.status) {
          case 500:
            msg = "Running version is probably too old to get build information";
          break;

          case 0:
            msg = "Make sure you are connected to the VPN";
            break;

          default:
          msg = err.responseText;

        }
        term.exception("Could not get commit hash of running version from build-service:\n" + msg);
        term.echo(color("Will use master version of proto instead", "#3399FF"));

      }).finally(function(){
        // Try to load the proto for each endpoint (asynchronously)
        // If we couldn't determine the commit hash it will be loading proto from master
        loadServiceProto(term, service, commit).fail(function(err){
          console.log(err);
          term.exception(err.message);
        }).finally(function(){
          term.resume();
        });
      });
    }

  };

  term.pause();
  Execute('com.hailocab.kernel.discovery', 'endpoints', {"service":service}).done(cb);
}

var CallExecute = function(term, service, endpoint, request) {
  var cb = function(data){
    term.echo(JSON.stringify(data, null, "\t"));
    var end = getTimeNow();
    var ms = end - start;

    term.echo();
    term.echo("Duration: " + parseInt(ms) + "ms");
  };

  // disable input while we wait for response
  term.pause();
  var start = getTimeNow();

  Execute(service, endpoint, request).then(cb, function(api, d){
    term.error(api.message);
    }).finally(function(){
      // enable input
      term.resume();
    });
}

var ProvisionService = function(term, endpoint, service, machine, version, az) {
  var req = {
    machineClass: machine,
    serviceName: service,
    serviceVersion: parseInt(version)
  };
  if (az) {
    req.azName = az;
  }
  CallExecute(term, 'com.hailocab.service.gateway', endpoint, req);
}

var RunProvisioningCommand = function(cmd, service, machine, version) {
  // Make sure version is a integer, as provision service request proto expect
  version = typeof(version) != typeof(1) ? parseInt(version) : version;
  return Execute('com.hailocab.kernel.provisioning', cmd, {serviceName: service, machineClass: machine, serviceVersion: version});
}

var GetBuildVersions = function(service, version) {
  var url = "https://jenkins-platmaster.eu-west-1.i.meta.hailocab.net:8443/builds/"+service+"/"+ (version != undefined ? version : '');

  return Q($.ajax({
    url: url,
    timeout: 2000,
    method: 'GET'
  }));
}

var color = function(msg, color, bg) {
  bg = bg || $('body').css('background-color');
  return "[[;"+color+";"+bg+"]" + $.terminal.escape_brackets(msg) + "]";
}

var completeServices = function(term, cmd) {
  if (cmd.args.length == 1 && services[cmd.args[0]]) {
    return [];
  }
  if (cmd.args.length > 1) {
    return [];
  }
  var names = Object.keys(services);
  names.sort();
  return names;
}

var getZones = function() {
  var allZones = {
    // Ireland
    'eu-west-1': ['a', 'b', 'c'], 
    // São Paulo
    'sa-east-1': ['a', 'b'], 
    // Tokyo
    'ap-northeast-1': ['a', 'b', 'c'], 
    // Singapore
    'ap-southeast-1': ['a', 'b'], 
    // Sydney
    'ap-southeast-2': ['a', 'b'], 
    // Virginia
    'us-east-1': ['a', 'b', 'c', 'd', 'e'], 
    // California
    'us-west-1': ['a', 'b', 'c'], 
    // Oregon
    'us-west-2': ['a', 'b', 'c']
  };

  var z = [];
  for(var zone in allZones) {
    allZones[zone].forEach(function(ext){
      z.push(zone + ext);
    });
  }

  return z;
}

var completeServicesProvisioning = function(term, cmd) {
  var classes = ["default", "web-public", "java", "stats", "auxiliary", "kernel", "location", "orchestration", "payments", "test", "v1api", "federation", "raziel"];
  var zones = getZones();
  if (cmd.args.length == 0 || (cmd.args.length == 1 && services[cmd.args[0]] == undefined)) {
    var names = Object.keys(services);
    names.sort();
    return names;
  } else if (cmd.args.length == 1 || (cmd.args.length == 2 && $.inArray(cmd.args[1], classes) == -1)) {
    var service = cmd.args[0];
    switch(cmd.name) {
      case "remove":
        return GetRunningServicesClasses(service).then(function(services){
          var results = [];
          
          services[service].forEach(function(data){
            results.push(data.class);
          });

          return results;
        });
    }

    return classes;
  } else if (cmd.args.length == 2 || cmd.args.length == 3) {
    var service = cmd.args[0];
    var versions = [];
    switch(cmd.name) {
      case "remove":
      case "restart":
        // this will return all running versions
        versions = GetServices({service: service}).then(function(data){
              var results = [];
              data.services.forEach(function(service){
                results.push(String(service.version));
              });
              return results;
          });
        break;
      case "provision":
        versions = GetBuildVersions(service).then(function(builds){
            var results = [];
            builds.forEach(function(build){
              results.push(build.Version);
            });
            return results;
        });
        break;
    }

    return versions.then(function(data){
      // If we already completed the argument, return empty list to
      // avoid completing the version twice
      if (cmd.args.length == 3 && $.inArray(String(cmd.args[2]), data) != -1) {
        if (cmd.name == 'restart') {
          return zones;
        }
        return [];
      }

      return data;
    });
  } else if (cmd.name == 'restart' && cmd.args.length == 4 && $.inArray(cmd.args[3], zones) == -1) {
    return zones;
  }
  return [];
}

var completeEndpoints = function(term, cmd, completed, len) {
  if (!len) len = 1;
  if (cmd.args.length == len && endpoints[currentService][cmd.args[len - 1]]) {
    
    var endpts = endpoints[currentService][cmd.args[len - 1]];
    if (!endpts['proto']) {
      return ["{}"];
    }
    return [JSON.stringify(getJson(endpts['proto'])).replace(/,/g, ", ").replace(/:/g, ": ")];
  }
  if (cmd.args.length > len) {
    return [];
  }
  if (currentService && ((cmd.args.length == len && !completed) || cmd.args.length == len - 1)) {
    var names = Object.keys(endpoints[currentService]);
    names.sort();
    return names;
  }
  return [];
}

var completeCommands = function(term, cmd, cmds) {
  if (cmd.args.length == 0 || (cmd.args.length == 1 && cmds[cmd.args[0]] == undefined)) {
    var names = Object.keys(cmds);
    names.sort();
    return names;
  }
  return []
}

var getAvailableCommands = function() {
  return !currentService ? globalCommands : allCommands;
}

var getCommitHash = function(sourceurl) {
  if(!sourceurl){
    return "";
  }
  var parts = sourceurl.split('/');
  if (parts.length < 4) {
    return "";
  }
  try {
    return parts[3].substr(0, 7);
  } catch (err) {}
  return "";
}

var getCompletion = function(term, what, cb) {

  var availableCommands = getAvailableCommands();

  var command = term.get_command();
  var cmd = $.terminal.parseCommand(command);
  var completed = command.length > 0 && command[command.length-1] == ' ';
  if (cmd.args.length == 0 && availableCommands[cmd.name] == undefined && !completed) {
    var names = Object.keys(availableCommands);
    names.sort();
    cb(names);
    return;
  }

  switch(cmd.name) {
    case "theme":
      cb(["light", "dark"]);
      return;
    case "use":
    case "cd":
    case "versions":
    case "health":
    case "upgrade":
      cb(completeServices(term, cmd));
      return;
    case "restart":
      var res = completeServicesProvisioning(term, cmd);
      if (res.indexOf != undefined) {
        cb(res);
      } else {
        res.then(function(versions){
          cb(versions);
        });
      }
      return;
    case "execute":
      cb(completeEndpoints(term, cmd, completed));
      return;
    case "repeat":
      cb(completeEndpoints(term, cmd, completed, 2));
      return;
    case "provision":
    case "remove":
      var res = completeServicesProvisioning(term, cmd);
      if (res.indexOf != undefined) {
        cb(res);
      } else {
        res.then(function(versions){
          cb(versions);
        });
      }
      return;
    case "help":
      cb(completeCommands(term, cmd, availableCommands));
      return;
  }
}

var getJson = function(protoObject) {
  var fields = {};
  var objects = {};
  protoObject.children.forEach(function(field){
    if (!field.type) {
      objects[field.name] = field;
      return;
    }
    switch(field.type.name) {
      case 'message':
        fields[ field.name ] = getJson(field.resolvedType);
        break;

      case 'string': 
        fields[ field.name ] = '';
        break;

      case 'bool':
        fields[ field.name ] = true;
        break;
        
      case 'bytes': 
        fields[ field.name ] = '';
        break;
        
      default: 
        fields[ field.name ] = 0;
    }

    // it should actually be an array
    if (field.repeated) {
      fields[field.name] = [fields[field.name]];
    }
  });
  return fields;
}

var getRequestFromProto = function(builder, service, endpoint, className) {
  var protoSource = getEndpointProtoPath(service, endpoint);
  // service names have been name changed in proto (virtual-meter => virtualmeter)
  var protoService = service.replace(/-/g, '');
  // Use proto and path to search for className object (com.hailocab.service.virtualmeter.read.Request)
  var fqn = protoService + '.' + endpoint + '.' + className;
  if (endpointsProtos[protoSource] && endpointsProtos[protoSource]['package']) {
    // Or use the package detected while parsing the proto (list endpoint could be using the read package)
    // ex: https://github.com/hailocab/virtual-meter-service/blob/master/proto/list/list.proto
    fqn = endpointsProtos[protoSource]['package'] + '.' + className;
  } else if (allProtos[protoSource] && allProtos[protoSource]['package']) {
    fqn = allProtos[protoSource]['package'] + '.' + className;
  }

  var protoObject = builder.lookup(fqn);
  if (protoObject) {
    // Just making sure all keys exists
    if(!endpoints[service]) endpoints[service] = {};
    if(!endpoints[service][endpoint]) endpoints[service][endpoint] = {};

    endpoints[ service ][ endpoint ]['proto'] = protoObject;
    return protoObject;
  } else {
    var parts = service.split('.');
    if (parts.length != 0) {
      var name = parts[parts.length-1].replace(/-/g, '');
    }
    throw new Error('Unable to find class in proto: ' + fqn); 
  }
}

var getGithubToken = function() {
  return localStorage.getItem('githubToken');
}

var getProtoFile = function(source, hash) {
  var src = getFullUrlProtoPath(source);

  if (!hash) {
    hash = 'master';
  } else {
    src = src + '?ref=' + hash;
  }

  var token = getGithubToken();
  if (!token) {
    throw new Error("You need to set your github token before you can access proto file from github");
  }

  return Q($.ajax({
    method: 'GET',
    url: src,
    headers: {
    "Accept": "application/vnd.github.v3.raw",
    "Authorization": "Basic " + Base64.encode(token + ':')
    }
  }));

}

var getEndpointProtoPath = function(service, endpoint) {
  var source = services[service]['source'];
  return source + "/proto/" + endpoint + "/" + endpoint + ".proto";
}

var getFullUrlProtoPath = function(path) {
  var file = path
    .replace('github.com/', '')
    .replace('/proto/', '/contents/proto/');
  return 'https://api.github.com/repos/' + file;

}

var filterEndpointsForProto = function(endpoints) {
  // @TODO: load these proto from the relevant service project
  var exlcudeEndpointsFromProto = ['stats', 'health', 'servicetypeschema', 'hobschema', 'jsonschema', 'loadedconfig'];
  var list = {};
  for (var name in endpoints) {
    if ($.inArray(name, exlcudeEndpointsFromProto) != -1) {
      // these endpoints have no proto in the service itself 
      continue;
    }

    list[name] = endpoints[name];
  }

  return list;
}

var getListOfEndpointsToLoadProto = function(service) {
  return filterEndpointsForProto(endpoints[ service ]);
}

// Point of entry for loading all protos files
var loadServiceProto = function(term, service, commit) {

  var builder = ProtoBuf.newBuilder();

  var source = services[service]['source'];
  term.echo(color('Loading proto from ' + source, "#00EE11"));

  var protos = [];

  for (var name in getListOfEndpointsToLoadProto(service)) {
    var protoSource = getEndpointProtoPath(service, name);
  
    // Already loaded
    if (allProtos[protoSource]){
      continue;
    }

    endpointsProtos[protoSource] = {service: service, endpoint: name};

    protos.push(loadProto(service, builder, protoSource, commit));
  }

  if (protos.length == 0) {
    return Q(true);
  }
  return Q.allSettled(protos).then(function(loaders){
    var protos = [];
    for(var i in loaders) {
      if(loaders[i].state != 'fulfilled' || loaders[i].value == undefined) {
        continue;
      }
      protos.push(loaders[i].value);
    }

    try {
      builder = loadProtoFromJson(builder, protos, service, commit);
    } catch (e) {
      console.log(e);
      term.error(e.message);
    }
    var root = builder.build();

    var requests = [];
    for (var name in getListOfEndpointsToLoadProto(service)) {
      try {
        var protoObject = getRequestFromProto(builder, service, name, 'Request');
        requests.push(protoObject);
      } catch(err) {
        console.log('Error trying to load Request object for endpoint', service, name, err);
        //throw new Error(err.message);
      }
    }

    return Q.all(requests);
  }, function(err){
    console.log(err);
  });

}

var flattenArray = function(protos) {
  var l = [];
  for(var j in protos) {
    if (typeof(protos[j]) != typeof("string")) {
      l.push.apply(l, flattenArray(protos[j]));
    } else {
      l.push(protos[j]);
    }
  }

  return l;
}

var loadImports = function(builder, protos, service, commit) {
  // Try to load dependencies
  for(var i in protos) {
    try {
      if (!allProtos[protos[i]]) {

          loadProto(service, builder, protos[i], commit);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return loadProtoFromJson(builder, protos, service, commit);
}

// This is first called when all endpoints protos have been loaded
// But dependencies might not have yet
var loadProtoFromJson = function(builder, loaders, service, commit) {
  var serviceProto;
  for (var i in loaders) {
    if(typeof(loaders[i]) == typeof('')) {
      serviceProto = loaders[i];
    } else {
      // Assume it's an array
      var protos = loaders[i];
      // first element is the proto path for the service endpoint
      serviceProto = protos.shift();

      // the rest are proto dependencies we need to load first
      if (protos.length != 0) {
        protos = flattenArray(protos);
        protos.reverse();
        builder = loadProtoFromJson(builder, protos, service, commit);
      }
    }

    // Parse the content
    var parser = new ProtoBuf.DotProto.Parser(allProtos[serviceProto]['raw']);
    var protoObject = parser.parse();
    if (!protoObject) {
      continue;
    }
    if (endpointsProtos[serviceProto]) {
      endpointsProtos[serviceProto]['package'] = protoObject.package;
    }

    // we have imports statements
    if (protoObject.imports.length != 0) {
      //
      // Load the imports manually
      builder = loadImports(builder, protoObject.imports, service, commit);
      // override imports as we don't want the ProtoBuf.loadJson to load them
      // as we need to change the path
      protoObject.imports = [];
    }
    if (builder.files[serviceProto]) {
      continue;
    }
    // try to load the endpoint proto
    try{
      //builder["import"](protoObject, builder, serviceProto);
      builder = ProtoBuf.loadJson(protoObject, builder, serviceProto);
    } catch (err) {
      console.log(serviceProto, 'unable to import', protoObject);
      throw new Error(err.message);
    }
  }
  return builder;
}

var isProtoFromService = function(serviceSource, protoSource) {
  return protoSource.slice(0, serviceSource.length) == serviceSource;
}

var loadProto = function(service, builder, url, hash) {
  if (!isProtoFromService(services[service]['source'], url)) {
    // load from master @TODO: check in Godeps which commit/branch
    hash = null;
  }
  if(allProtos[url] && allProtos[url]['loaded']){
    //return;
    throw new Error('will not load - already loading');
  }
  allProtos[url] = {loaded: true};
  return getProtoFile(url, hash).then(function(content){
    // Save content
    allProtos[url]['raw'] = content;

    var parser = new ProtoBuf.DotProto.Parser(content);
    var ast = parser.parse();
    var loaders = [];
    if (allProtos[url]) {
      allProtos[url]['package'] = ast.package;
    }
    //var result = Q(url);
    for(var i in ast.imports) {
      if (allProtos[ast.imports[i]]) {
        // Already imported
        continue;
      }
      loaders.push(loadProto(service, builder, ast.imports[i], hash));
    }
    if (loaders.length == 0) {
      return Q(url);
    }
    loaders.unshift(url);
    return Q.all(loaders);
  },function(err){
    delete allProtos[url];
    console.log(err);
    var msg;
    if (err.statusText) {
      switch(err.status) {
        case 401:
          msg = err.responseJSON.message;
          msg += "\nIs your access token correct?\n" + getGithubToken();
          break;

        default:
          msg = err.responseJSON.message;
      }
    } else {
      msg = err.message;
    }

    throw new Error("Unable to download proto file: " + msg);
  });
}

var Upgrade = function(term, cmd, currentService) {
    term.exception('not implemented');
    return;
    if (getEnvironment() == 'lve') {
        term.exception('upgrade is prohibited on this environment');
        return;
    }

    var service;
    if (cmd.args.length == 0 && currentService) {
        service = currentService;
    } else if(cmd.args.length != 0) {
        service = $.trim(cmd.args[0]);
    }

    if (!service) {
        term.exception('no service provided, usage:');
        term.echo('upgrade [service]');
        return;
    }

    if (services[service] != undefined) {
        var latest;
        term.pause();
        GetBuildVersions(service).then(function(builds){
            var versions = [];
            builds.forEach(function(build){
                versions.push(build.Version);
            });
            if (versions.length != 0 ) {
                versions.sort();
                versions.reverse();
                latest = versions[0];
                return latest;
            }
            throw new Error("Couldn't not find latest available version");
        }).then(function(latest){
            return GetRunningServicesClasses(service).then(function(services){
                var results = [];
                
                services[service].forEach(function(data){
                    if (data.version != latest) {
                        results.push(data);
                    }
                });

                return results;
            });
        }).then(function(versions){
            if( versions.length == 0 ) {
                throw new Error("Nothing to remove - all versions are running latest");
            }
            var machines = [];
            versions.forEach(function(data){
                machines.push(data.class);
            });

            var commands = [];

            machines.forEach(function(cls){
                console.log('should provision version ' + latest + ' to ' + cls);
                commands.push(RunProvisioningCommand('create', service, cls, latest));
            });

            return Q(commands).all().then(function(results){
                var commands = [];
                versions.forEach(function(data){
                    console.log('should remove version ' + data.version + ' from ' + data.class);
                    commands.push(RunProvisioningCommand('delete', service, data.class, data.version));
                });

                return Q(commands).all();
            }).fail(function(err){
                console.log(err);
                throw new Error("unable to provision latest version: " + err.message);
            });
        }).fail(function(err){
            console.log(err);
            term.exception('unable to upgrade: ' + err.message);
        }).finally(function(){
            term.resume();
        });

    } else {
        term.exception('service invalid or not loaded');
    }
}

var terminal = $('body').terminal(function(command, term) {

    var cmd = $.terminal.parseCommand(command);
    if (cmd.name == 'help') {
        Help(term, cmd);      
    } else if (cmd.name == 'list' || cmd.name == 'ls') {
        List(term, cmd, currentService);
    } else if (cmd.name == 'provision') {
        Provision(term, cmd);
    } else if (cmd.name == 'remove') {
        Remove(term, cmd);
    } else if (cmd.name == 'upgrade') {
        Upgrade(term, cmd, currentService);
    } else if (cmd.name == 'theme') {
        Theme(term, cmd);
    } else if (cmd.name == 'use' || cmd.name == 'cd') {
        currentService = UseCd(term, cmd, currentService);
    } else if (cmd.name == 'execute') {
        ExecuteCommand(term, cmd, command);
    } else if (cmd.name == 'repeat') {
        Repeat(term, cmd);
    } else if (cmd.name == 'restart') {
        Restart(term, cmd, currentService);
    } else if (cmd.name == 'health') {
        Health(term, cmd, currentService);
    } else if (cmd.name == 'versions') {
      Versions(term, cmd, currentService);
    } else {
        term.exception('unknown command');
    }
}, { prompt: getPrompt(), name: 'hshell', greetings: 'Welcome to Hailo Web HShell', outputLimit: 1000, completion: getCompletion }).focus(true);

var List = function(term, cmd, currentService) {
    if (currentService) {
        term.echo(color("Getting list of endpoints for service " + currentService, "#00EE11"));
        var names = Object.keys(endpoints[currentService]);
        names.sort();
        names.forEach(function(name){
            term.echo(name);
        });
    } else {
        term.echo(color("Getting list of services", "#00EE11"));
        var names = Object.keys(services);
        names.sort();
        names.forEach(function(name){
            term.echo(name);
        });
    }
}

var Provision = function(term, cmd) {
    if (cmd.args.length == 3) {
        var service = $.trim(cmd.args[0]);
        if (services[service] != undefined) {
            // currentService = service; // @todo wtf is this  
            ProvisionService(term, 'provision', cmd.args[0], cmd.args[1], cmd.args[2]);
        } else {
            term.exception('service invalid or not loaded');
        }
    } else {
        term.exception('Syntax error, usage:');
        term.echo(color('provision [service] [machine] [version]', "#3399FF"));
    }
}

var Help = function(term, cmd) {
    var availableCommands = getAvailableCommands();
    if (cmd.args.length == 0) {
        term.echo("Commands:");
        
        var names = Object.keys(availableCommands);
        names.sort();
        names.forEach(function(name){
          term.echo("\t" + name);
        });
    } else if(availableCommands[cmd.args[0]] != undefined) {
        term.echo("Help for " + cmd.args[0]);
        term.echo("\t" + availableCommands[cmd.args[0]]);
    } else {
        term.exception('command unknown');
    }
}

var Repeat = function(term, cmd) {
    if (!currentService) {
        term.exception("Please load a service first");
        return;
    }
    if (cmd.args.length >= 3) {
        var endpoint = $.trim(cmd.args[1]);
        if (!endpoints[currentService][endpoint]) {
            term.exception('endpoint invalid');
            return;
        }
        var request = command.split(' ').slice(3).join(' ');
        var req;
        try {
            req = JSON.parse(request);
        } catch(err) {
            term.exception("Invalid request, " + err);
            return;
        }

        var number;
        try {
            number = parseInt(cmd.args[0]);
        } catch(err) {
            term.exception("Unable to parse number of requests. usage:");
            term.echo('repeat X [endpoint] {}');
        }

        var funcs = [];
        for(var i=0; i<number; i++) {
            funcs.push(Execute(currentService, endpoint, req));
        }

        term.pause();
        var start = getTimeNow();

        Q.all(funcs).finally(function(){
            var end = getTimeNow();
            var ms = end - start;
            term.echo();
            term.echo("Duration: " + parseInt(ms*1e6) + " (" + (ms/1000) + "s)");
            term.echo("Throughput: " + (funcs.length/(ms/1000)) + "/s");
            term.resume();
        });
    } else {
        term.exception('Syntax error, usage:');
        term.echo('repeat X [endpoint] {}');
    }
}

var Remove = function(term, cmd) {
    if (cmd.args.length == 3) {
        var service = $.trim(cmd.args[0]);
        if (services[service] != undefined) {
            // currentService = service; // @todo why was this here
            ProvisionService(term, 'deprovision', cmd.args[0], cmd.args[1], cmd.args[2]);
        } else {
            term.exception('service invalid or not loaded');
        }
    } else {
        term.exception('Syntax error, usage:');
        term.echo(color('remove [service] [machine] [version]', "#3399FF"));
    }
}

var Restart = function(term, cmd, currentService) {
    if (cmd.args.length >= 3) {
        var service = $.trim(cmd.args[0]);
        if (services[service] != undefined) {
            currentService = service;
            
            var az;
            if (cmd.args.length > 3) {
                az = cmd.args[3];
            }
            ProvisionService(term, 'restartservice', cmd.args[0], cmd.args[1], cmd.args[2], az);
        } else {
            term.exception('service invalid or not loaded');
        }
    } else {
        term.exception('Syntax error, usage:');
        term.echo(color('remove [service] [machine] [version]', "#3399FF"));
    }
}

var Health = function(term, cmd, currentService) {
    var service;
    if (cmd.args.length == 0 && currentService) {
        service = currentService;
    } else if(cmd.args.length != 0) {
        service = $.trim(cmd.args[0]);
    } else {
        term.exception('no service provided, usage:');
        term.echo('health [service]');
        return;
    }

    if (services[service] != undefined) {
        CallExecute(term, service, 'health', {});
    } else {
        term.exception('service invalid or not loaded');
    }
}

var ExecuteCommand = function(term, cmd, command) {
    if (!currentService) {
        term.exception("Please load a service first");
        return;
    }
    if (cmd.args.length >= 2) {
        var endpoint = $.trim(cmd.args[0]);
        if (!endpoints[currentService][endpoint]) {
          term.exception('endpoint invalid');
          return;
        }
        var request = command.split(' ').slice(2).join(' ');
        var req;
        try {
          req = JSON.parse(request);
        } catch(err) {
          term.exception("Invalid request, " + err);
          return;
        }
        
        CallExecute(term, currentService, endpoint, req);
    } else {
        term.exception('Syntax error, usage:');
        term.echo('execute [endpoint] {}');
    }
}

var Theme = function(term, cmd) {
    if (cmd.args.length == 1) {
        var theme = $.trim(cmd.args[0]);
        switch (theme) {
          case 'light':
            $('.terminal, .cmd').css('background-color', 'fff');
            $('.terminal, .cmd').css('color', '333');
            break;
          case 'dark':
            $('.terminal, .cmd').css('background-color', '000');
            $('.terminal, .cmd').css('color', 'aaa');
            break;
          default:
            term.exception('Unknown color theme. Available: light, dark');
        }
    } else {
        term.exception('Syntax error, usage:');
        term.echo(color('theme [name]', "#3399FF"));
    }
}

var UseCd = function(term, cmd, currentService) {
    if (cmd.args.length == 1) {
        var service = $.trim(cmd.args[0]);
        if (services[service] != undefined) {
            currentService = service;
            term.set_prompt(getPrompt(service));
            GetEndpoints(term, service);
        } else if (service == '..') {
            currentService = "";
            term.set_prompt(getPrompt());
        } else {
            term.exception('service invalid or not loaded');
        }
    } else {
        term.exception('Syntax error, usage:');
        term.echo(color('use [service]', "#3399FF"));
    }
    return currentService;
}

var GetCurrentService = function(term, cmd, currentService) {
    var service;
    if (cmd.args.length == 0 && currentService) {
        service = currentService;
    } else if(cmd.args.length != 0) {
        service = $.trim(cmd.args[0]);
    }
    return service;
}

var Versions = function(term, cmd, currentService) {
    var service = GetCurrentService(term, cmd, currentService);
    if (service.length == 0) {
        term.exception('no service provided, usage:');
        term.echo('versions [service]');
        return;
    }

    if (services[service] != undefined) {
        term.pause();
        var versions = {};

        // this will return all running versions
        GetRunningServicesClasses(service).then(function(services){
            var results = [];
            for(var srv in services) {
              services[srv].forEach(function(data){
                  if (!versions[ srv ]) {
                      versions[ srv ] = {};
                  }
                  if (!versions[ srv ][ data.version ]) {
                      versions[ srv ][ data.version ] = {classes: []};
                      // Fetch info about this version
                      results.push(GetBuildVersions(srv, data.version));
                  }
                  versions[ srv ][ data.version ]['classes'].push(data.class);
              });
            }

            return Q.all(results);
        }, function(err){
            console.log(err);
            throw new Error("Unable to get information from running versions: " + err.message);
        })
        .then(function(results){
            results.forEach(function(build){
                versions[ build.Name ][ build.Version ]['branch'] = build.Branch;
                versions[ build.Name ][ build.Version ]['hash'] = getCommitHash(build.SourceURL);
            });
        }, function(err){
          console.log(err);
          var msg = "Couldn't get branches information from versions: ";

          if (err.statusText) {
            msg += err.statusText;
          } else {
            msg += err.message;
          }
          term.error(msg);
        })
        .finally(function(){
          var service = GetCurrentService(term, cmd, currentService);

          if (versions[service] && versions[service].length != 0) {

            var lines = [];
            var fullInfo = false;
            for(var service in versions) {

                for(var version in versions[service]) {

                  var content = versions[service][version] ? versions[service][version] : {};

                  if (content['classes'] && content['hash'] && content['branch']) {

                    content['classes'].forEach(function(cls){
                        var row = [version, cls, content['hash'], content['branch']];
                        lines.push(row);
                        fullInfo = true;
                    });
                  } else {
                      lines.push(version);
                  }
                }

            }

            // Print stuff
            //
            if (fullInfo) {
              term.echo(["Version\t   ", "Machine", "Hash", "   Branch"].join("\t"));
            } else {
              term.echo("Version");
            }

            lines.forEach(function(line){
              if (fullInfo) {
                term.echo(line.join("\t"));
              } else {
                term.echo(line);
              }
            });
          }

          term.resume();
        });
    } else {
        term.exception('service invalid or not loaded');
    }
}

var globalCommands = {
  "use": "use [service] sets the given service to be the active service. ie. the service you want to make calls from", 
  "cd": "cd [service] sets the given service to be the active service. ie. the service you want to make calls from", 
  "list": "list [service] Prints the services or endpoints depending on contex", 
  "ls": "ls [service] Prints the services or endpoints depending on contex", 
  "versions": "versions [service] Prints the versions running of a given service", 
  "health": "health [service] calls the healthcheck endpoint on a service", 
  "upgrade": "upgrade [service] Provision the latest service", 
  "restart": "restart [service] [class] [version] [azname] restarts a specific service in an az (az is optional)", 
  "provision": "provision [service] [machine class] [version] Provisions the given service", 
  "remove": "remove [service] [machine class] [version] Removes the given service from the provisioned list", 
  "theme": "theme [name] Change terminal color", 
  "help": "help help... who types help help?"
};

var serviceCommands = {
  "execute": "execute [endpoint] [json] sends the given json to the given endpoint for the active service", 
  "repeat": "repeat [x] [endpoint] [json] sends the given json to the given endpoint for the active service x number of times"
};

var allCommands = $.extend({}, globalCommands, serviceCommands);
var services = {};
var endpoints = {};
var currentService;
var environment;
var allProtos = {};
var endpointsProtos = {};


var app = new Webapp();
app.ready.then(function(webapp){
  webapp.config.then(function(data){
    environment = data.environment.environment;
    terminal.set_prompt(getPrompt());
  });
  FetchServicesList();
});

});
