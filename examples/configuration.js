module.exports = {
    label: "All EnOcean IP Devices",
    id: "allEnOceanIPDevices",
    autoDiscoveryDeviceTypes: [],
    devices: [{
        label: "Gateway",
        id: "gateway",
        plugin: "enocean-ip/gateway",
        configuration: {
            host: "192.168.5.101",
            port: 8080,
            gatewayId: 'DC-GW/EO-IP v0.99.43',
            adminAccount: 'admin',
            adminPassword: 'admin'
        },
        actors: [/*{
         "class": "Actor",
         "id": "outlet1",
         "label": "Outlet 1",
         "type": "outlet",
         "logLevel": "debug",
         "configuration": {
         deviceId: '01A0355D'
         }
         }, {
            "class": "Actor",
            "id": "rockerSwitch2Rocker_1",
            "label": "Rocker Switch 2 Rocker 1",
            "type": "rockerSwitch2Rocker",
            "logLevel": "debug",
            "configuration": {
                deviceId: '002FD652'
            }
        }, {
            "class": "Actor",
            "id": "rockerSwitch2Rocker_2",
            "label": "Rocker Switch 2 Rocker 2",
            "type": "rockerSwitch2Rocker",
            "logLevel": "debug",
            "configuration": {
                deviceId: '002FD5BB'
            }
        }*/],
        sensors: [{
         "class": "Sensor",
         "id": "occupancySensor1",
         "label": "Occupancy Sensor 1",
         "type": "occupancySensor",
         "logLevel": "debug",
         "configuration": {
             deviceId: '050B6FFA'
         }
         }/*, {
         "class": "Sensor",
         "id": "temperatureSensor1",
         "label": "Temperature Sensor 1",
         "type": "temperatureSensor",
         "logLevel": "debug",
         "configuration": {
         deviceId: '4'
         }
         }*/],
        logLevel: "debug"
    }],
    groups: [],
    services: [],
    eventProcessors: [],
    data: []
};
