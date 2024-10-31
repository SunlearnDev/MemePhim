const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
  NO_CONTENT: "No Content",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

class SuccessResponse {
  constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
    this.message = message || ReasonStatusCode[statusCode];
    this.metadata = metadata;
    this.statusCode = statusCode;
  }

  send(res, headers = {}) {
    res.status(this.statusCode).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, statusCode: StatusCode.OK, reasonStatusCode: ReasonStatusCode.OK, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED, metadata });
  }
}

module.exports = { OK, CREATED, SuccessResponse };
