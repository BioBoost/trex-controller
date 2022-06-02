# Thumper TRex Controller

NodeJS package for controlling the TRex motor controller of the Thumper platform.

## Important

This package is meant to be used with the new TRex `thumper-v4` firmware which can be found at [https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4](https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4).

## Usage Example

```js
import { TRexController } from '@thumper/trex-controller';
import rpio from 'rpio';

rpio.i2cBegin();
rpio.i2cSetSlaveAddress(0x07);
rpio.i2cSetBaudRate(100000);

let controller = new TRexController(rpio);

console.log(controller.battery());

rpio.i2cEnd();
```

## Dependencies

TODO