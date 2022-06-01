class TRexController {

  constructor() {
    console.log(`Creating new TRexController`);
  }

  stop() {
    console.log("Sending stop command to motor controller")
  }

  async battery() {
    return new Promise((resolve) => {
      setTimeout(() => { resolve('Battery = 12V') }, 500);
    });
  }
}

export { TRexController }