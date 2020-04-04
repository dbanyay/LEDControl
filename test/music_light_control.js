const WebSocket = require('ws');
const TuyAPI = require('tuyapi');

const ws = new WebSocket('ws://localhost:5000');

const device = new TuyAPI({
    id: '16537702cc50e3ede21a',
    key: '52eb33191b581c0f'
});

let deviceConnected = false;
const DPS_INDEX_ON = '20';
const DPS_INDEX_MODE = '21';
const DPS_INDEX_BRIGHTNESS = '22';
const DPS_INDEX_COLOURTEMP = '23';
const DPS_INDEX_COLOUR = '26';

const immediate_color = '24';
const RED = '000003e803e8';
const GREEN = '007803e803e8';
const BLUE = '00f003e803e8';
const WHITE = '0000000003e8';


const faded_color = "28";
const FADING_RED = '0000303e803e800000000';
const FADING_GREEN = '0007803e803e800000000';
const FADING_BLUE = '000f003e803e800000000';
const FADING_WHITE = '00000000003e800000000';

ws.on('open', function open() {
    // ws.send('something');
    console.log('open');
});

// Find device on network
device.find().then(() => {
    // Connect to device
    device.connect();

});

// Add event listeners
device.on('connected', () => {
    console.log('Connected to device!');
    deviceConnected = true;

});

device.on('disconnected', () => {
    console.log('Disconnected from device.');
    deviceConnected = false;
    console.log("Reonnecting to device...");
    device.find().then(() => {
        // Connect to device
        device.connect();
    });
});

device.on('error', error => {
    console.log('Error!', error);
});

device.on('data', data => {
    // console.log('Data from device:', data);
});


const minEllapsedTime = 50;

let startTime = Date.now();

ws.on('message', function incoming(data) {
    // console.log(data);
    if (deviceConnected) {
        if ((Date.now() - startTime) >= minEllapsedTime) {
            device.set({dps: immediate_color, set: data});
            // console.log(data);
            startTime = Date.now()
        }
    }
});
