import { I2cDevice } from './i2c-device';
import { TRexStatus } from './trex-status';

class TRexController {
  device: I2cDevice;
  invert: boolean = false;
  killTimer: ReturnType<typeof setTimeout>;

  STATUS_PACKET_SIZE = 9;
  START_BYTE = 0x0f;

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

  battery() : number {
    return this.status().battery_voltage;
  }

  status() : TRexStatus {
    let buffer = Buffer.alloc(this.STATUS_PACKET_SIZE);    
    this.device.i2cRead(buffer);

    if (buffer[0] != this.START_BYTE) throw new Error('Failed to read status from TRex Controller');
    
    return {
      errors: buffer[1],
      battery_voltage: ((buffer[3] * 256) + buffer[2]) / 100.0,
      left_motor_current: ((buffer[5] * 256) + buffer[4]),
      right_motor_current: ((buffer[7] * 256) + buffer[6]),
      operation_mode: buffer[8]
    };

  }
}

export { TRexController };
