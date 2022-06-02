// Declare what functionality we expect I2cDevice to provide
declare class I2cDevice {
  i2cRead(buffer: Buffer, length?: number): any;
  i2cWrite(buffer: Buffer, length?: number): any;
}

export { I2cDevice }