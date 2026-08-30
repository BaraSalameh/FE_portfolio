import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpsOptions = {
        key: fs.readFileSync(process.env.LOCAL_SSL_KEY),
        cert: fs.readFileSync(process.env.LOCAL_SSL_CERT),
        ca: fs.readFileSync(process.env.LOCAL_SSL_CA),
    };
    
    createServer(httpsOptions, (req, res) => handle(req, res, parse(req.url, true)))
    .listen(3000, () => {
        console.log("🚀 HTTPS dev server running at https://localhost:3000");
    });
});
