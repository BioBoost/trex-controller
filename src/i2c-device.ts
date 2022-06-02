// Declare what functionality we expect I2cDevice to provide
declare class I2cDevice {
  write(values: number[], callback: (err: any) => void): void;
  read(length: number, callback: (err: any, res: number[]) => void): void;
}

export { I2cDevice }