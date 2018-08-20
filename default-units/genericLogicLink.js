module.exports = {
    metadata: {
        plugin: "genericLogicLink",
        label: "LOGICDATA LOGIClink",
        role: "actor",
        family: "genericLogicLink",
        deviceTypes: ["logicdata-mqtt/broker"],
        services: [],
        state: [{
            label: "Occupied",
            id: "occupied",
            type: {
                id: "boolean"
            }
        }, {
            label: "Ticks/Minute",
            id: "ticksPerMinute",
            type: {
                id: "integer"
            }
        }, {
            label: "Last Motion Timestamp",
            id: "lastMotionTimestamp",
            type: {
                id: "string"
            }
        }],
        configuration: [{
            label: "Device ID",
            id: "deviceId",
            type: {
                id: "string"
            }
        }, {
            label: "Ghost Ticks Interval",
            id: "ghostTickInterval",
            type: {
                id: "integer"
            }
        }]
    },
    create: function () {
        return new GenericLogicLink();
    }
};

var q = require('q');
var moment = require('moment');

/**
 *
 */
function GenericLogicLink() {
    /**
     *
     */
    GenericLogicLink.prototype.start = function () {
        var deferred = q.defer();

        this.state = {occupied: false, ticksPerMinute: 0};

        if (!this.configuration.ghostTickInterval) {
            this.configuration.ghostTickInterval = 2;
        }

        if (this.isSimulated()) {
            this.interval = setInterval(function () {
                this.state.occupied = !this.state.occupied;

                if (this.state.occupied) {
                    this.state.ticksPerMinute = Math.round(Math.random() * 10);
                    this.state.lastMotionTimestamp = moment().toISOString();
                } else {
                    this.state.ticksPerMinute = 0;
                }

                this.publishStateChange();
            }.bind(this), 10000);

            deferred.resolve();
        }
        else {
            var tickCount = 0;

            this.tickCountInterval = setInterval(function () {
                this.state.ticksPerMinute = tickCount;

                this.publishStateChange();

                tickCount = 0;
            }.bind(this), 60000);

            this.device.adapter.listeners.push((client, message) => {
                if (message.deviceId === this.configuration.deviceId) {
                this.logDebug('Device ' + telegram.friendlyId + ' is processing ', telegram.functions);
            }
        });

            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    GenericLogicLink.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    GenericLogicLink.prototype.setState = function (state) {
        this.state = state;
    };

    /**
     *
     */
    GenericLogicLink.prototype.stop = function () {
        if (this.isSimulated()) {
            if (this.interval) {
                clearInterval(this.interval);
            }
        } else {
            if (this.occupancyInterval) {
                clearInterval(this.occupancyInterval);
            }

            if (this.tickCountInterval) {
                clearInterval(this.tickCountInterval);
            }
        }
    }
}