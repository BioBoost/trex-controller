import { I2cDevice } from './i2c-device';
import { TRexStatus } from './trex-status';
import { TRexCommand } from './trex-command';
import { rejects } from 'assert';

class TRexController {
  device: I2cDevice;
  invert: boolean = false;
  killTimer: ReturnType<typeof setTimeout> | undefined;
  safetyKillTime: number = 1000;

  STATUS_PACKET_SIZE = 9;
  COMMAND_PACKET_SIZE = 9;
  START_BYTE = 0x0f;

  default_command : TRexCommand = {
    left_motor_speed: 0,
    left_motor_brake: 0,
    right_motor_speed: 0,
    right_motor_brake: 0,
    battery_threshold: 5.6
  };

  constructor(device: I2cDevice, { invert = false, safetyKillTime = 1000 } = {}) {
    this.device = device;
    this.invert = invert;
    this.safetyKillTime = safetyKillTime;
  }

  stop() {
    this._stop();
  }

  battery() : Promise<number> {
    return new Promise((resolve, reject) => {
      this._status().then((status) => {
        resolve(status.battery_voltage);
      }).
      catch((reason) => { reject(reason) })
    })
  }

  forward(percentage: number) {
    this._speed(percentage, percentage);
  }

  backwards(percentage: number) {
    this._speed(-percentage, -percentage);
  }

  // Private Methods

  _status() : Promise<TRexStatus> {
    let buffer = Buffer.alloc(this.STATUS_PACKET_SIZE);
    return new Promise((resolve, reject) => {
      this.device.read(buffer, this.STATUS_PACKET_SIZE)
      .then((bytes_read) => {
        if (bytes_read.buffer[0] != this.START_BYTE) reject('Startbyte not found. Failed to read status from TRex Controller');
        resolve(this._buffer_to_status(bytes_read.buffer));
      })
    })
  }

  _speed(left: number, right: number) {
    left = Math.floor(Math.min(left, 100) * 255 / 100);
    right = Math.floor(Math.min(right, 100) * 255 / 100);

    if (this.invert) {
      left = -left;
      right = -right;
    }

    this._clear_kill_timer();

    let buffer = this._command_to_buffer(
      Object.assign({}, this.default_command, { left_motor_speed: left, right_motor_speed: right })
    );
    this._send(buffer);

    this._setup_kill_timer();
  }

  _stop() {
    this._speed(0, 0);
    // TODO: If all went well?
    this._clear_kill_timer();
  }

  _send(buffer: Buffer) {
    console.log('_send: ');
    console.log(buffer);
    this.device.write(buffer, this.COMMAND_PACKET_SIZE);      // TODO: Promise !!!! - will fix close error
  }

  _clear_kill_timer() {
    if (this.killTimer) {
      clearTimeout(this.killTimer);
    }
  }

  _setup_kill_timer() {
    this.killTimer = setTimeout(() => {
      console.log('Stopping motors because of kill timer');
      this._stop();
    }, this.safetyKillTime);
  }

  _command_to_buffer(command : TRexCommand) : Buffer {
    let buffer = Buffer.alloc(this.COMMAND_PACKET_SIZE);
  
    buffer[0] = this.START_BYTE;
  
    buffer[1] = (command.left_motor_speed & 255);
    buffer[2] = ((command.left_motor_speed >> 8) & 255);
    buffer[3] = command.left_motor_brake;
  
    buffer[4] = (command.right_motor_speed & 255);
    buffer[5] = ((command.right_motor_speed >> 8) & 255);
    buffer[6] = command.right_motor_brake;
  
    buffer[7] = ((command.battery_threshold * 100) & 255);
    buffer[8] = (((command.battery_threshold * 100) >> 8) & 255);
  
    return buffer;
  }

  _buffer_to_status(buffer : Buffer) : TRexStatus {
    return {
      errors: buffer[1],
      battery_voltage: ((buffer[3] * 256) + buffer[2]) / 100.0,
      left_motor_current: ((buffer[5] * 256) + buffer[4]),
      right_motor_current: ((buffer[7] * 256) + buffer[6]),
      operation_mode: buffer[8]
    }
  }
  
}

export { TRexController };
