require("./infrastructure/prototype-extension")
const Path = require("path");
const Application = require("./application");
const Configuration = require("./infrastructure/configuration");
const TeachConsumer = require("./infrastructure/consumer/teach-consumer");
const BullArena = require("bull-arena");

class Boot {

    static main() {
        process.env.ROOT_DIR = Path.resolve(__dirname);
        const configuration = new Configuration().get();
        const queues = Boot.startQueueAndConsumer(configuration);
        const arenaConfig = BullArena({
            queues: [
              {
                name: "teach",
                hostId: "teach-queue",
                redis: configuration.database.redis,
              }
            ],
          },
          {
            basePath: "/",
            disableListen: true
          });
        const application = new Application(configuration);
        application.start(queues, arenaConfig);
    }

    static startQueueAndConsumer(configuration) {
        const retchConsumer = new TeachConsumer(configuration);
        return {
            teach: retchConsumer.register()
        };
    }

}


try {
    Boot.main();
} catch(err) {
    console.log(err);
}
