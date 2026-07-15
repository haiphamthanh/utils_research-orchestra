const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5100);
const publicDir = path.join(__dirname, "public");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8" };

http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || host}`).pathname;
  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const target = path.resolve(publicDir, relative);

  if (!target.startsWith(`${publicDir}${path.sep}`)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(target, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" }).end(content);
  });
}).listen(port, host, () => console.log(`Research Orchestra: http://${host}:${port}`));
