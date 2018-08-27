module.exports = {
    label: "LOGIClink Test",
    id: "logicLinkTest",
    autoDiscoveryDeviceTypes: [],
    devices: [{
        label: "Broker",
        id: "broker",
        plugin: "logicdata-mqtt/broker",
        configuration: {
            host: "10.225.219.226",
            port: 1883
        },
        actors: [{
            "class": "Actor",
            "id": "link1",
            "label": "Link 1",
            "type": "genericLogicLink",
            "logLevel": "debug",
            "configuration": {
                deviceId: 'LOGIClink1'
            }
        }],
        sensors: [],
        logLevel: "debug"
    }],
    groups: [],
    services: [],
    eventProcessors: [],
    data: []
};
