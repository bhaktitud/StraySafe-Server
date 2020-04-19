class CustomError {
  constructor(status, msg) {
      this.status = status;
      this.message = msg;
  }
}

module.exports = CustomError;
