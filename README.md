h2 - a microservices platform
===

The microservices architecture is a powerful way to organize and run large codebases - however, without appropriate tooling,
it can also introduce tremendous complexity.

At Hailo, we already have that tooling, and as avid users of free and open source software, thought about giving back to the community and encourage people
dive into the amazing world of microservices.

This project is still in its infancy, but - we hope - it is already useful enough for people who are willing to get their hands dirty!

### What's included now?

#### A set of core services required to run and call services

What's the use of services if you can't call them, huh? You can run a service, connect to your h2 cluster (or to anyone else's if they are reckless enough), call other services,
call your service or any other from the outside world (through http), etc.

![Examplecode](docs/screenshots/examplecode.png)

#### Libraries that have automatic access to infrastructure

Cassandra? NSQ? A thin wrapper around these libraries are provided, to make them autoload config, and listen to config changes. 

#### Configuration

A config service and its pair, a config dashboard, provide you an easy way to set or read config data either manually or from services.

![Configeditor](docs/screenshots/devconfig.png)

#### User management

The login service handles authentication, user roles, sessions and more. Users web is an easy way to manage users.

![Usersweb](docs/screenshots/usersweb.png)

#### Hshell

Hshell is the goto tool to interact with services and their endpoints. List services, their endpoints, call the endpoints and see the returned data.

![Usersweb](docs/screenshots/hshell.png)

### What's coming up?

##### Tracing

A debugger only works within a single process, where is your god now?
Fear not, distributed tracing enables you to visualize all the service calls happening on your cluster!

##### Monitoring

How to know that your services are healthy? The monitoring service collects metrics from standard and custom healthchecks and the monitoring web visualizes the information.

##### Logs

View and search services logs from your browser.

##### Errors

Your system is flooded with errors but reading the logs is very hard, needles are getting lost in the haystack... but the errors service groups and counts messages so you easily see what's going on. 

##### Platform events

You get a call from a robot at 3am telling you that you won't get more sleep tonight, what do you do? Platform events let you see all config changes, deployments and more.

##### Playground

You don't have time to build a fully fledged frontend for your app? The playground let's you write and share short frontend scripts that talk to the backend easily.

## Installation

### Pre-prerequisites

- Git
- Install Go and configure your GOPATH. If you don't know how to you can follow https://golang.org/doc/code.html
- Bazaar - Go needs it
- Cassandra CLI tool named cqlsh. You can install it via pip.
- Docker

```
sudo easy_install pip
sudo pip install cqlsh
```

### Creating the Docker machine

1. Run 

```
docker-machine create --driver virtualbox --virtualbox-memory "2048" h2
```

to create docker machine. (The amount of memory is important - Cassandra might fail to start with less.)

2. Get its ip by typing `docker-machine ip h2`. 
3. Update your `/etc/hosts` file with the ip of h2 machine to enable the web apps.

```
192.168.59.103 hlabs.com
192.168.59.103 hshell.hlabs.com
192.168.59.103 login.hlabs.com
192.168.59.103 homescreen.hlabs.com
192.168.59.103 playground.hlabs.com
192.168.59.103 dev-config.hlabs.com
192.168.59.103 users.hlabs.com
```

Replace 192.168.59.103 with your h2 machine's ip.

### Setting up Docker containers

1. Checkout the h2 repo to your local.
2. Go to `docker` folder and run

```shell
bash docker/build.sh
docker-compose up
````

### Bootstrapping the platform

1. You have to run some Cassandra CQL commands once the cassandra container is running (you can try running the cassandra container only with `docker-compose up cassandra`)

```
cqlsh $(docker-machine ip h2) -f bootstrap/schemas.cql
```

#### Connecting to the cluster

Go to `scripts` directory. 

```
source setenv.sh $(docker-machine ip h2)
sudo bash copy.sh
```

#### Running example service

Step into `example` directory and run

```
go get
sudo -E go run main.go
```

Once you get everything up and running successfully, you should be able to access http://hshell.hlabs.com ( default username is admin and password is Password1 )

Try listing all services running using `ls` command. You should see `com.hailocab.service.template` in the list. To run the example endpoint of it

1. Run `cd com.hailocab.service.template`
2. Run `execute foo {}`
3. You should get a response like

```
{
    "baz": "There are 7 services running on your h2 cluster"
}
```

### Known issues

- The homescreen & users web login page does not work. Use the hshell one to get around this.
- The hlabs domain is hardcoded in the nginx config and in the web discovery binary.

### Troubleshooting

You can see the problems and solutions in `docs/troubleshooting.md` file.
