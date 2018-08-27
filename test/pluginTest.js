var assert = require("assert");

describe('[thing-it] LOGIClink Broker Plugin', function () {
    var testDriver;

    before(function () {
        testDriver = require("thing-it-test").createTestDriver({logLevel: "debug", simulated: false});

        testDriver.registerDevicePlugin('logicdata-mqtt', __dirname + "/../broker");
        testDriver.registerUnitPlugin(__dirname + "/../default-units/genericLogicLink");
    });
    describe('Start Configuration', function () {
        this.timeout(5000);

        it('should complete without error', function () {
            return testDriver.start({
                configuration: require("../examples/configuration.js"),
                heartbeat: 20
            });
        });
    });
    describe('Actor Events', function () {
        this.timeout(100000);

        before(function () {
            testDriver.removeAllListeners();
        });
        it('should receive state change messages', function (done) {
            testDriver.addListener({
                publishActorStateChange: function (deviceId, actorId, state) {
                    console.log('Event received: ', actorId);

                    if (actorId === 'link1') {
                        done();
                    }
                }
            });
        });
    });

    // describe('Actor Services', function () {
    //     this.timeout(5000);
    //
    //     before(function () {
    //         testDriver.removeAllListeners();
    //     });
    //     it('should receive state change messages', function (done) {
    //         testDriver.addListener({
    //             publishActorStateChange: function (deviceId, actorId, state) {
    //                 // if (sensorId === 'occupancySensor1') {
    //                 //     done();
    //                 // }
    //             }
    //         });
    //
    //         // testDriver.devices[0].findActor('outlet1').toggle();
    //     });
    // });

    // describe('Actor Services', function () {
    //     this.timeout(5000);
    //
    //     before(function () {
    //         testDriver.removeAllListeners();
    //     });
    //     it('should receive state change messages', function (done) {
    //         testDriver.addListener({
    //             publishActorStateChange: function (deviceId, actorId, state) {
    //                 if (sensorId === 'switch1') {
    //                     done();
    //                 }
    //             }
    //         });
    //
    //         testDriver.devices[0].findActor('switch1').toggle();
    //     });
    // });
});





