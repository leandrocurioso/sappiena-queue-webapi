const Controller = require("../controller");

const baseUri = "/health";
class HealthController extends Controller {

    constructor(configuration, router) {
        super(configuration, router);
    }

    //> GET(/)
    check(context) {
        return [
            async (req, res, next) => context.respond(res, 200)
        ];
    }

}

HealthController.baseUri = baseUri;
module.exports = HealthController;
