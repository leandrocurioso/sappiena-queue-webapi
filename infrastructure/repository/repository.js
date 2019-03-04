class Repository {

    constructor(configuration, connection) {
        this.configuration = configuration;
        this.connection = connection;
    }

    async query(sql, params = {}) {
        return new Promise((resolve, reject) => {
            const prep = this.connection.prepare(sql);
            this.connection.query(prep(params), (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });		
    }

}

module.exports = Repository;
