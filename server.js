const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8080;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

http.createServer((request, response) => {
  const requested = decodeURIComponent(request.url.split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  const file = path.resolve(root, `.${relative}`);
  if (!file.startsWith(root + path.sep)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Evidencija rada: http://localhost:${port}`);
});
