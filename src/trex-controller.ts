import { I2cDevice } from './i2c-device';

class TRexController {
  device: I2cDevice;
  invert: boolean = false;
  killTimer: ReturnType<typeof setTimeout>;

  constructor(device: I2cDevice, { invert = false, safetyKillTime = 1000 } = {}) {
    this.device = device;
    this.invert = invert;

    this.killTimer = setTimeout(() => {
      console.log('Stopping motors because of kill timer');
      this.stop();
    }, safetyKillTime);
  }

  stop() {
    console.log('Sending stop command to motor controller');
  }

  async battery() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Battery = 12V');
      }, 500);
    });
  }
}

export { TRexController };
