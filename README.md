# Thumper TRex Controller

NodeJS package for controlling the TRex motor controller of the Thumper platform.

## Important

This package is meant to be used with the new TRex `thumper-v4` firmware which can be found at [https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4](https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4).

## Usage Example

```js
import { TRexController } from '@thumper/trex-controller';
import i2c from 'i2c-bus';
import { BytesRead, BytesWritten } from '@thumper/trex-controller/lib/i2c-device';

console.log("Starting service ....");

class I2CBusWrapper {

  address: number;
  bus: i2c.PromisifiedBus | undefined;

  constructor(address = 0x20) {
    this.address = address;
  }

  open() : Promise<I2CBusWrapper> {
    return new Promise((resolve, reject) => {
      i2c.openPromisified(1).
      then((bus) => {
        this.bus = bus;
        resolve(this);
      }).catch((reason) => {
        reject(reason);
      });
    })
  }

  read(buffer: Buffer, length: number): Promise<BytesRead> {
    if (!this.bus) throw new Error('I2C Bus is not initialized!');
    return this.bus.i2cRead(this.address, length, buffer);
  }

  write(buffer: Buffer, length: number): Promise<BytesWritten> {
    if (!this.bus) throw new Error('I2C Bus is not initialized!');
    return this.bus.i2cWrite(this.address, length, buffer);
  }

  close() {
    if (!this.bus) throw new Error('I2C Bus is not initialized!');
    return this.bus.close();
  }
}

let i2cBus = new I2CBusWrapper(0x20);
let controller = new TRexController(i2cBus);

i2cBus.open().
then(() => {
  controller.battery()
  .then((voltage) => {
    console.log('Voltage = ' + voltage);
    console.log('Backwards ...')
    controller.backwards(20);
  })
}).catch((err) => {
  console.log(err);
})

try {
  setTimeout(async () => {
    console.log('Going forward ...')
    await controller.forward(20);
    const voltage = await controller.battery();
    console.log('Voltage = ' + voltage);
    console.log('Stopping')
    await controller.stop();
  }, 2000);
}
catch(e) {
  console.log(e)
}

setInterval(async () => {
  console.log('Keeping alive ...');
}, 5000)

process.on("SIGINT", async () => {
  console.log('SIGINT');
  console.log("Stopping controller ....")
  await controller.stop();
  console.log('Closing bus')
  await i2cBus.close();       // This fails for some reason
});

process.once('SIGTERM', async () => {
  console.log('SIGTERM');
  console.log("Stopping controller ....")
  await controller.stop();
  console.log('Closing bus')
  await i2cBus.close();       // This fails for some reason
});
```

## Dependencies

TODO