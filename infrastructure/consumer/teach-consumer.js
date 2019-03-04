const Consumer = require("./consumer");
const BullQueue = require("bull");

class TeachConsumer extends Consumer {

    constructor(configuration) {
        super(configuration);
    }
    
    register() {
        const teach = new BullQueue("teach", { redis: this.configuration.database.redis });
        teach.process(async (job) => {
            
            job.progress(100);
            return console.log(job.data);
        });;
        return teach;
    }

}

module.exports = TeachConsumer;
