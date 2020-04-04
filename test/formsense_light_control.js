const WebSocket = require('ws');
const TuyAPI = require('tuyapi');

const ws = new WebSocket('ws://localhost:3000');

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

const white_timeout = 600;


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

ws.on('message', function incoming(data) {
    console.log(data);

    var data_dict = JSON.parse(data);

    const exercise = data_dict['result']['exercise_id'];
    const cur_pass_counter = data_dict['result']['rep_count_pass'];
    const cur_fail_counter = data_dict['result']['rep_count_fail'];
    const rep_status = data_dict['result']['status'];

    if (rep_status === "finished") {
        if (grades[exercise]['pass'] !== cur_pass_counter) {
            grades[exercise]['pass'] = cur_pass_counter;
            if (deviceConnected) {
                device.set({dps: faded_color, set: FADING_GREEN});
                setTimeout(setWhite, white_timeout);

            }
        } else {
            grades[exercise]['fail'] = cur_fail_counter;
            if (deviceConnected) {
                device.set({dps: faded_color, set: FADING_RED});
                setTimeout(setWhite, white_timeout);

            }
        }
    }
});

function setWhite(){
    device.set({dps: faded_color, set: FADING_WHITE});
}

let grades = {
    "overhead_squat": {'pass': 0, 'fail': 0},
    "inline_lunge_left_leg_front": {'pass': 0, 'fail': 0},
    "inline_lunge_right_leg_front": {'pass': 0, 'fail': 0},
    "single_leg_raise_left": {'pass': 0, 'fail': 0},
    "single_leg_wide_left": {'pass': 0, 'fail': 0},
    "single_leg_raise_right": {'pass': 0, 'fail': 0},
    "single_leg_wide_right": {'pass': 0, 'fail': 0}
};
