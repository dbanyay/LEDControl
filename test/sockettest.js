const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  // ws.send('something');
  console.log('open');
});

let grades = {"overhead_squat":{'pass': 0, 'fail':0},
              "inline_lunge_left_leg_front":{'pass': 0, 'fail':0},
              "inline_lunge_right_leg_front":{'pass': 0, 'fail':0},
              "single_leg_raise_left":{'pass': 0, 'fail':0},
              "single_leg_wide_left":{'pass': 0, 'fail':0},
              "single_leg_raise_right":{'pass': 0, 'fail':0},
              "single_leg_wide_right":{'pass': 0, 'fail':0}};

ws.on('message', function incoming(data) {
  console.log(data);

  var data_dict = JSON.parse(data);

  const exercise = data_dict['result']['exercise_id'];
  const cur_pass_counter = data_dict['result']['rep_count_pass'];
  const cur_fail_counter = data_dict['result']['rep_count_fail'];
  const rep_status =  data_dict['result']['status'];

  console.log(exercise, "  prev_fail: ", grades[exercise]['fail'], " prev_pass:  ",grades[exercise]['pass']);
  console.log(exercise, "  cur_fail: ", cur_fail_counter, " cur_pass:  ",cur_pass_counter);


  if(rep_status === "finished") {
    if (grades[exercise]['pass'] !== cur_pass_counter) {
      grades[exercise]['pass'] = cur_pass_counter;
      console.log("GREEN");
    }
    else {
      grades[exercise]['fail'] = cur_fail_counter;
      console.log("RED");
    }
  }


  console.log(exercise)

});