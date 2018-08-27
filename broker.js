module.exports = {
    metadata: {
        family: 'logic-data-mqtt',
        plugin: 'broker',
        label: 'LOGICDATA MQTT Broker',
        manufacturer: 'LOGICDATA',
        discoverable: true,
        tangible: false,
        additionalSoftware: [],
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: [
            {
                label: "Host",
                id: "host",
                type: {
                    id: "string"
                },
                defaultValue: "192.168.192.1"
            }, {
                label: "Port",
                id: "port",
                type: {
                    id: "integer"
                },
                defaultValue: 55555
            }, {
                label: "Admin Account",
                id: "adminAccount",
                type: {
                    id: "string"
                }
            }, {
                label: "Admin Password",
                id: "adminPassword",
                type: {
                    id: "password"
                }
            }
        ]
    },
    create: function () {
        return new Broker();
    },
    discovery: function () {
        return new BrokerDiscovery();
    }
};

var q = require('q');

/**
 *
 * @constructor
 */
function BrokerDiscovery() {
    /**
     *
     * @param options
     */
    BrokerDiscovery.prototype.start = function () {
        if (this.isSimulated()) {
            this.timer = setInterval(function () {
            }.bind(this), 20000);
        } else {
            this.logLevel = 'debug';
        }
    };

    /**
     *
     * @param options
     */
    BrokerDiscovery.prototype.stop = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }

    };
}

/**
 *
 * @constructor
 */
function Broker() {
    /**
     *
     */
    Broker.prototype.start = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            this.logDebug("Starting Broker in simulated mode.");

            deferred.resolve();
        } else {
            this.adapter = new Adapter().initialize(this.configuration.host, this.configuration.port, this);

            this.logDebug('Adapter initialized.');

            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    Broker.prototype.stop = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            this.logDebug("Stopping Broker in simulated mode.");
        } else {
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    Broker.prototype.getState = function () {
        return {};
    };

    /**
     *
     */
    Broker.prototype.setState = function () {
    };
}

function Adapter() {
    Adapter.prototype.initialize = function (host, port, logger) {
        this.listeners = [];

        var settings = {host: host, port: port};
        var mosca = require('mosca');
        var server = new mosca.Server(settings);

        server.on('clientConnected', function(client) {
            logger.logInfo('MQTT client connected', client.id);
        });

        server.on('published', function(packet, client) {
            for (var n in this.listeners) {
                this.listeners[n](packet);
            }
        });

        server.on('ready', () => {
            logger.logDebug('MQTT Broker started');
        });

        return this;
    }

    /**
     *
     */
    Adapter.prototype.registerListener = function (callback) {
        this.listeners.push(callback);
    };
}