export class BaseError extends Error {
  constructor({name:name, httpCode:httpCode, description:description, isOperational:isOperational}) {
    super(description);
    //Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
