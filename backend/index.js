import app from ".app.js"
import "./database.js"
import {config} from "./config.js"

async function main() {
    app.listen(config.server.PORT)
    console.log("server on port: " + config.server.PORT)
}

main();