module.exports = {
    metadata: {
        plugin: "genericLogicLink",
        label: "LOGICDATA LOGIClink",
        role: "actor",
        family: "genericLogicLink",
        deviceTypes: ["logicdata-mqtt/broker"],
        services: [
            {id: "toggleGreenLED", label: 'Toggle Green LED'},
            {id: "toggleRedLED", label: 'Toggle Red LED'},
            {id: "unbindLED", label: 'Unbind LED'}
        ],
        state: [{
            label: "Occupied",
            id: "occupied",
            type: {
                id: "boolean"
            }
        }, {
            label: "Green LED",
            id: "greenLED",
            type: {
                id: "boolean"
            }
        }, {
            label: "Red LED",
            id: "redLED",
            type: {
                id: "boolean"
            }
        }, {
            label: "Height",
            id: "height",
            type: {
                id: "integer"
            }
        }, {
            label: "Table Position",
            id: "tablePosition",
            type: {
                id: "string"
            }
        }, {
            label: "Activity",
            id: "activity",
            type: {
                id: "string"
            }
        }, {
            label: "Up Button",
            id: "upButton",
            type: {
                id: "boolean"
            }
        }, {
            label: "Down Button",
            id: "downButton",
            type: {
                id: "boolean"
            }
        }, {
            label: "Reset Button",
            id: "resetButton",
            type: {
                id: "boolean"
            }
        }, {
            label: "Data Message",
            id: "dataMessage",
            type: {
                id: "string"
            }
        }, {
            label: "USB",
            id: "usb",
            type: {
                id: "string"
            }
        }, {
            label: "BLE",
            id: "ble",
            type: {
                id: "string"
            }
        }, {
            label: "NFC",
            id: "nfc",
            type: {
                id: "string"
            }
        }, {
            label: "LOGIClink System",
            id: "logicLinkSystem",
            type: {
                id: "string"
            }
        }
        ],
        configuration: [{
            label: "Device ID",
            id: "deviceId",
            type: {
                id: "string"
            },
        }]
    },
    create: function () {
        return new GenericLogicLink();
    }
};

var q = require('q');
var moment = require('moment');
var mqtt = require('mqtt');

/**
 *
 */
function GenericLogicLink() {
    /**
     *
     */
    GenericLogicLink.prototype.start = function () {
        var deferred = q.defer();

        this.state = {occupied: false, greenLED: false,
            redLED: false, height: 0, tablePosition: 'Sitting',
            activity: 'Invalid', upButton: false, downButton: false,
            resetButton: false, dataMessage:'0', usb:'Not Connected',
            ble:'Not Connected', nfc:'Removed', logicLinkSystem:'None'};

        if (this.isSimulated()) {
            this.interval = setInterval(function () {
                this.state.occupied = !this.state.occupied;

                if (this.state.occupied) {
                    this.state.greenLED = true;
                    this.state.redLED = false;
                    this.state.height =0;
                    this.state.tablePosition = 'Sitting';
                    this.state.activity = 'Invalid';
                    this.state.upButton = false;
                    this.state.downButton = false;
                    this.state.resetButton= false;
                    this.state.dataMessage='0';
                    this.state.usb='Not Connected';
                    this.state.ble='Not Connected';
                    this.state.nfc='Removed';
                    this.state.logicLinkSystem='None'
                } else {
                    this.state.greenLED = false;
                    this.state.redLED = true;
                    this.state.height =0;
                    this.state.tablePosition = 'Standing';
                    this.state.activity = 'Invalid';
                    this.state.upButton = false;
                    this.state.downButton = false;
                    this.state.resetButton= false;
                    this.state.dataMessage='0';
                    this.state.usb='Connected';
                    this.state.ble='Connected';
                    this.state.nfc='Detected';
                    this.state.logicLinkSystem='None'
                }

                this.publishStateChange();
            }.bind(this), 10000);

            deferred.resolve();
        } else{
            this.device.adapter.listeners.push(packet => {
                let device = this.configuration.deviceId;
                let packetId = packet.topic.substring(0, (device.length-1));
                if(packetId === this.configuration.deviceId){
                    let message = packet.payload.toString();
                    if(packet.topic === device+'/EVENT/HEIGHT') this.state.height = parseInt(message,8);
                    else if(packet.topic === device+'/EVENT/BUTTON/CLICKS_UP'){
                        if(parseInt(message) === 1) this.state.upButton = true;
                        else this.state.upButton = false;
                    }
                    else if(packet.topic === device+'/EVENT/BUTTON/CLICKS_DOWN'){
                        if(parseInt(message) === 1) this.state.downButton = true;
                        else this.state.downButton = false;
                    }
                    else if(packet.topic === device+'/EVENT/BUTTON/CLICKS_RESET'){
                        if(parseInt(message) === 1) this.state.resetButton = true;
                        else this.state.resetButton = false;
                    }
                    else if(packet.topic === device+'/EVENT/DISPATCHED_DATA/MESSAGE') this.state.dataMessage = message;
                    else if(packet.topic === device+'/EVENT/DISPLAYED_FAULT') this.state.fault = message;
                    else if(packet.topic === device+'/EVENT/BLE_CON_P'){
                        if (message === 'll_connected') this.state.ble = 'Connected';
                        else this.state.ble = 'Not Connected';
                    } else if(packet.topic === device+'/EVENT/DISPATCHED_DATA/INTF'){
                        if (message === 'll_intf_flag_usb') this.state.usb = 'Interface Flagged';
                        else this.state.ble = 'Interface Flagged';
                    } else{
                        switch(message){
                            case 'll_led_none':
                                this.state.greenLED = false;
                                this.state.redLED = false;
                                break;
                            case 'll_led_green':
                                this.state.greenLED = true;
                                break;
                            case 'll_led_red':
                                this.state.redLED = true;
                                break;
                            case 'll_led_all':
                                this.state.greenLED = true;
                                this.state.redLED = true;
                                break;
                            case 'll_occupied':
                                this.state.occupied = true;
                                break;
                            case 'll_not_occupied':
                                this.state.occupied = false;
                                break;
                            case 'll_table_position_sitting':
                                this.state.tablePosition = 'Sitting';
                                break;
                            case 'll_table_positionStanding':
                                this.state.tablePosition = 'Standing';
                                break;
                            case 'll_table_position_invalid':
                                this.state.tablePosition = 'Invalid';
                                break;
                            case 'll_user_activity_active':
                                this.state.activity = 'Active';
                                break;
                            case 'll_user_activity_inactive':
                                this.state.activity = 'Inactive';
                                break;
                            case 'll_user_activity_away':
                                this.state.activity = 'Away';
                                break;
                            case 'll_intf_flag_usb':
                                this.state.usb = 'Interface Flagged';
                                break;
                            case 'll_intf_flag_logiclink_system':
                                this.state.logicLinkSystem = 'Interface Flagged';
                                break;
                            case 'll_intf_flag_ble':
                                this.state.ble = 'Interface Flagged';
                                break;
                            case 'll_intf_flag_nfc':
                                this.state.nfc = 'Interface Flagged';
                                break;
                            case 'll_nfc_detected':
                                this.state.nfc = 'Detected';
                                break;
                            case 'll_nfc_removed':
                                this.state.nfc = 'Removed';
                                break;
                            case 'll_connected':
                                this.state.usb = 'Connected';
                                break;
                            case 'll_not_connected':
                                this.state.usb = 'Not Connected';
                                break;
                        }
                    }
                    this.publishStateChange();
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
        }
    };
    /**
     *
     */
    GenericLogicLink.prototype.setLED = function(topic){
        client = mqtt.connect({host: this.configuration.host, port: this.configuration.port});
        client.subscribe(topic);

        this.logDebug('Publishing to topic: ', topic);

        client.publish(topic);
        client.end();
    };
    /**
     *
     */
    GenericLogicLink.prototype.toggleGreenLED = function(){
        let promise;
        let topic;
        this.logDebug('Toggling Green LED');

        if(this.state.greenLED) topic = this.configuration.deviceId+'/LED/GREEN/OFF';
        else topic = this.configuration.deviceId+'/LED/GREEN/ON';

        promise = this.setLED(topic);

        return promise;
    };
    /**
     *
     */
    GenericLogicLink.prototype.toggleRedLED = function(){
        let promise;
        let topic;
        this.logDebug('Toggling Red LED');

        if(this.state.redLED) topic = this.configuration.deviceId+'/LED/RED/OFF';
        else topic = this.configuration.deviceId+'/LED/RED/ON';

        promise = this.setLED(topic);

        return promise;
    };
    /**
     *
     */
    GenericLogicLink.prototype.unbindLED = function(){
        let promise;
        let topic;
        this.logDebug('Unbinding LED ');

        topic = this.configuration.deviceId+'/LED/UNBIND';

        promise = this.setLED(topic);

        return promise;
    };
}