module.exports = {
    label: "LOGIClink Test",
    id: "logicLinkTest",
    autoDiscoveryDeviceTypes: [],
    devices: [{
        label: "Broker",
        id: "broker",
        plugin: "logicdata-mqtt/broker",
        configuration: {
            host: "192.168.5.101",
            port: 8080
        },
        actors: [{
            "class": "Actor",
            "id": "link1",
            "label": "Link 1",
            "type": "genericLogicLink",
            "logLevel": "debug",
            "configuration": {}
        }],
        sensors: [],
        logLevel: "debug"
    }],
    groups: [],
    services: [],
    eventProcessors: [],
    data: []
};
