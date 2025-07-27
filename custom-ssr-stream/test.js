import http from 'http';
import fs from 'fs';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
};


const chunks = [];

const req = http.request(options, (res) => {
  res.setEncoding('utf8');

  res.on('data', (chunk) => {
    chunks.push(chunk);
    console.log('Received chunk:', chunk);
  });

  res.on('end', () => {
    console.log('No more data.');
    fs.writeFileSync('chunks.json', JSON.stringify(chunks, null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
