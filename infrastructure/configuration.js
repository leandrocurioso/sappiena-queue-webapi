const GetEnv = require("getenv");
const DotEnv = require("dotenv");
const Path = require("path");

class Configuration {

    get(rootDir = process.env.ROOT_DIR, filename = ".env") {
        DotEnv.config({  path: Path.join(rootDir, filename) });
        const config = {
            nodeEnv: GetEnv.string("NODE_ENV", "development"),
            server: {
                name: GetEnv.string("SERVER_NAME", "server"),
                port: GetEnv.int("SERVER_PORT", 3000)
            },
            database: {
                redis: {
                    host: GetEnv.string("REDIS_HOST", "127.0.0.1"),
                    port: GetEnv.int("REDIS_PORT", 6379),
                    password: GetEnv.string("REDIS_PASSWORD")
                }
            },
            arena: {
                baseUri: GetEnv.string("ARENA_BASE_URI", "/ui"),
                username: GetEnv.string("ARENA_UI_USERNAME", "admin"),
                password: GetEnv.string("ARENA_UI_PASSWORD")
            }
        };
        process.env.NODE_ENV = config.nodeEnv;
        return config;
    }

}

module.exports = Configuration;
