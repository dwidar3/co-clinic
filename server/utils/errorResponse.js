// utils/errorResponse.js
class ErrorResponse extends Error {
  constructor(i18nKey, statusCode) {
    super(i18nKey); // Still passes the key as message
    this.statusCode = statusCode;
    this.i18nKey = i18nKey; // Store separately
  }
}

export default ErrorResponse;
