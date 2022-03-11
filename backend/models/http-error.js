class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //add a msg props
    this.code = errorCode; //ads a code prop
  }
}

module.exports = HttpError;
