class ApiErrorModel extends Error {

    constructor(message, httpStatusCode) {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }
}

module.exports = ApiErrorModel;
