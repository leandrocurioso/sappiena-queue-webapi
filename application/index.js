const ApiErrorModel = require("./model/api-error-model");
const Express = require("express");
const Logger = require("morgan");
const Http = require('http');
const HttpResponse = require('./http-response');
const ControllerRegister = require('./controller/controller-register');
const Cors = require("cors");
const Path = require("path");
const Chalk = require("chalk");
const BasicAuth = require("express-basic-auth");

class Application {

  constructor(configuration, express = Express()) {
    this.configuration = configuration;
    this.express = express;
  }

  start(queues, arenaConfig) {
    this.express.disable('x-powered-by');
    this.express.set("port", this.configuration.server.port);
    this.server = Http.createServer(this.express);
    if (this.configuration.nodeEnv === "development") {
      this.express.use(Logger("dev"));
    }
    this.express.use(Cors());
    this.express.use(Express.json());
    this.express.use(this.configuration.arena.baseUri, BasicAuth({
      users: { [this.configuration.arena.username]: this.configuration.arena.password },
      challenge: true
    }), arenaConfig);
    this.express.use((req, res, next) => {
      req["queues"] = queues;
      return next();
    });
    this.express.use("/", new ControllerRegister(this.configuration).autoload(Path.join(process.env.ROOT_DIR, "application", "controller", "route")));
    this.registerMiddleware();
    this.server.listen(this.configuration.server.port, () => {
      console.log(Chalk.greenBright(`[${this.configuration.server.name}] - Listening on http://localhost:${this.configuration.server.port}`));
    });
  }

  registerMiddleware() {
    this.express.use((req, res, next) => {
      const err = new ApiErrorModel("Not Found");
      err.httpStatusCode = 404;
      return next(err);
    });

    this.express.use((err, req, res, next) => {
      if (err.isJoi) {
        return HttpResponse.respond(res, 400, { validationErrors: err.details });
      }
      return HttpResponse.respond(res, err.httpStatusCode || 500, { errors: [err] });
    });
  }

}

module.exports = Application;
