const TuyAPI = require('tuyapi');

const device = new TuyAPI({
    id: '16537702cc50e3ede3e2',
    key: 'cb54aa1b77593963',
});

(async () => {
  await device.find();

  await device.connect();

  let status = await device.get();

  console.log(`Current status: ${status}.`);

  await device.set({set: !status});

  status = await device.get();

  console.log(`New status: ${status}.`);

  device.disconnect();
})();