import http from 'http';
import fs from 'fs';
import path from 'path';

const server = http.createServer(({ method, url }, res) => {
  if (method === 'GET' && url === '/') {
    fs.readFile('./dist/index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plan' });
        res.end('Internal Server Error');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    
    return;
  }
  
  if (method === 'GET' && url?.startsWith('/public/')) {
    const fileName = url.split('/public/').pop() as string;
    
    if (!fileName) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
    
    const filePath = path.join(__dirname, fileName);
    
    console.log(filePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const contentType = getContentType(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const getContentType = (filePath: string) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    case '.wav':
      return 'audio/wav';
    default:
      return 'text/plain';
  }
};

const hostname = 'http://localhost';
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running at ${hostname}:${port}/`);
});