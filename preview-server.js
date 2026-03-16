const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const host = '0.0.0.0';
const port = Number(process.env.PORT || 8080);
const rootDir = __dirname;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp'
};

function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (entry.family === 'IPv4' && !entry.internal) {
        ips.push(entry.address);
      }
    });
  });

  return ips;
}

function sendFile(filePath, response) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
      response.end(error.code === 'ENOENT' ? 'File not found' : 'Server error');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[\\/])+/, '');
  const filePath = path.join(rootDir, normalizedPath);

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isDirectory()) {
      sendFile(path.join(filePath, 'index.html'), response);
      return;
    }

    sendFile(filePath, response);
  });
});

server.listen(port, host, () => {
  console.log(`Local preview running at http://localhost:${port}`);
  getLocalIps().forEach((ip) => {
    console.log(`Phone preview: http://${ip}:${port}`);
  });
  console.log('Keep this terminal open while previewing.');
});
