class HttpResponse {

    static respond(response, httpStatusCode, data = {}) {
        const result = {};

        if (data.validationErrors) {
            return response.status(httpStatusCode).json({
                errors: data.validationErrors.map(validationError => ({ message: validationError.message, path: validationError.path }))
            });
        }

        if (Array.isArray(data.errors) && data.errors.length) {
            result["errors"] = data.errors.map(error => ({
                message: error.message,
                stack: ((process.env.NODE_ENV === "development") ? error.stack : undefined)
            }));
            return response.status(httpStatusCode).json(result);
        }

        if (data.payload) {
            result["payload"] = data.payload;
            return response.status(httpStatusCode).json(result);
        }

        return response.status(httpStatusCode).end("");
    }

}

module.exports = HttpResponse;
