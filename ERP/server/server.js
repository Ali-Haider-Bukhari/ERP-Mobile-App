const express = require('express');
const next = require('next');
const http = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const clients = [];

app.prepare().then(() => {
  const server = express();

  server.use(express.static('public'));

  server.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the client to the list
    clients.push(res);

    req.on('close', () => {
      // Remove the client when the connection is closed
      clients.splice(clients.indexOf(res), 1);
    });
  });

  server.post('/send', express.json(), (req, res) => {
    const { message } = req.body;

    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify({ message })}\n\n`);
    });

    res.status(200).json({ success: true });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = http.createServer(server);

  httpServer.listen(8081, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:8081');
  });
});
