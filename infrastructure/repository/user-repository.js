const Repository = require("./repository");
const UserEntity = require("../../domain/model/entity/user-entity");

class UserRepository extends Repository {

    constructor(configuration, connection) {
        super(configuration, connection);
    }

    async checkIfEmailExists(email) {
        const sql = `SELECT 1
                     FROM user 
                     WHERE email = :email
                     LIMIT 1`;
        const rows = await this.query(sql, { email });
        return rows.length > 0;
    }

    async authenticate(email, password) {
        const sql = `SELECT id AS user_id,
                            email AS user_email
                     FROM user 
                     WHERE email = :email
                     AND password = :password
                     AND active = 1
                     LIMIT 1`;
        const rows = await this.query(sql, { email, password });
        return ((rows.length) ? UserEntity.fromSqlResult(rows[0]) : null);
    }

    async create(userEntity) {
        const sql = `INSERT INTO user
        (
            first_name,
            last_name,
            email,
            timezone,
            avatar,
            password,
            verified,
            active,
            created_at
        )
        VALUES
        (
            :firstName,
            :lastName,
            :email,
            :timezone,
            :avatar,
            :password,
            :verified,
            :active,
            :createdAt
        )`;
        return await this.query(sql, 
        {
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            email: userEntity.email,
            timezone: userEntity.timezone,
            avatar: userEntity.avatar,
            password: userEntity.password,
            verified: ((userEntity.verified) ? 1 : 0),
            active: ((userEntity.active) ? 1 : 0),
            createdAt: userEntity.createdAt
        });
    }
}

module.exports = UserRepository;
