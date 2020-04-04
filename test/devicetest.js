const TuyAPI = require('tuyapi');

const device = new TuyAPI({
    id: '16537702cc50e3ede21a',
    key: '52eb33191b581c0f'
});

let deviceConnected = false;
let isGreen = true;

const DPS_INDEX_ON = '20';
const DPS_INDEX_MODE = '21';
const DPS_INDEX_BRIGHTNESS = '22';
const DPS_INDEX_COLOURTEMP = '23';
const DPS_INDEX_COLOUR = '26';

const immediate_color = '24';
const RED = '000003e803e8';
const GREEN = '007803e803e8';
const BLUE = '00f003e803e8';

const faded_color = "28";
const FADING_RED = '0000303e803e800000000';
const FADING_GREEN = '0007803e803e800000000';
const FADING_BLUE = '000f003e803e800000000';
const FADING_WHITE = '00000000003e800000000';

const timer = "26";
const time = '1';

console.log(process.version)

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
    console.log("Reonnecting to device...")
    device.find().then(() => {
        // Connect to device
        device.connect();
    });
});

device.on('error', error => {
    console.log('Error!', error);
});

device.on('data', data => {
    console.log('Data from device:', data);

});

function blinker(device) {

    if (deviceConnected) {

        if (isGreen) {
            device.set({dps: immediate_color, set: RED});
            isGreen = false
        } else {
            device.set({dps: timer, set: time});
            isGreen = true

        }
    }

}

function fading_blinker(device) {

    if (deviceConnected) {

        if (isGreen) {
            device.set({dps: faded_color, set: FADING_RED});
            setTimeout(setWhite, 800);

            isGreen = false
        } else {
            device.set({dps: faded_color, set: FADING_GREEN});
            setTimeout(setWhite, 800);

            isGreen = true

        }
    }

}


function numHex(s) {
    var a = (s % 360).toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}


function color_changer(device, colorObject, periodInSec=18) {

    if (deviceConnected) {

        suffix = '03e803e8';

        hexHue = numHex(colorObject.hue);

        colorObject.hue = colorObject.hue + Math.round(18/periodInSec);

        hexString = hexHue.padStart(4, '0').concat(suffix);

        device.set({dps: immediate_color, set: hexString});

        // console.log(hexString)
    }
}

function setWhite() {
    device.set({dps: faded_color, set: FADING_WHITE});
}

let colorObject = {hue: 0};


setInterval(fading_blinker, 5000, device);
// setInterval(blinker, 2000, device);
//
const timeOut = 50;
// setInterval(color_changer, timeOut, device, colorObject ,timeOut, 1);