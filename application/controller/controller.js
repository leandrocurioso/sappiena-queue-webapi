const HttpResponse = require("../http-response");
const Joi = require("joi");
const Express = require("express");

class Controller {

    constructor(configuration,router = Express.Router()) {
        this.configuration = configuration;
        this.router = router
    }

    registerRoute(preBundle) {
        this.router[preBundle.httpVerb.toLowerCase()](preBundle.baseUri, this[preBundle.method](this));
        return this.router;
    }

    validateRequest(expectedSchem, joiSchema, next) {
        return Joi.validate(expectedSchem, joiSchema)
               .then(() => next())
               .catch(err => next(err));
    }

    respond(response, httpStatusCode, data = {}) {
        return HttpResponse.respond(response, httpStatusCode, data);
    }

}

module.exports = Controller;
