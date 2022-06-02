# Thumper TRex Controller

NodeJS package for controlling the TRex motor controller of the Thumper platform.

## Important

This package is meant to be used with the new TRex `thumper-v4` firmware which can be found at [https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4](https://github.com/BioBoost/thumper_trex_firmware/tree/thumper-v4).

## Usage Example

```js
import { TRexController } from '@thumper/trex-controller';

class FakeI2cDevice {
  write(values: number[], callback: (err: any) => void) { }
  read(length: number, callback: (err: any, res: number[]) => void) { }
}

let controller = new TRexController(new FakeI2cDevice());

controller.battery()
.then((result) => {
  console.log(result)
})
```

## Dependencies

TODO