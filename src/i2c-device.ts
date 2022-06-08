export type BytesWritten = { bytesWritten: number; buffer: Buffer };
export type BytesRead = { bytesRead: number; buffer: Buffer };

// Declare what functionality we expect I2cDevice to provide
export declare class I2cDevice {
  read(buffer: Buffer, length: number): Promise<BytesRead>;
  write(buffer: Buffer, length: number): Promise<BytesWritten>;
}
