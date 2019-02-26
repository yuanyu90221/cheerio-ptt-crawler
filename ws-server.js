const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 3000 || Number(process.argv[1]);

const app = express();
const server = app.listen(PORT, ()=>{
  console.log(`ws-server is listen on ${PORT}`);
});

const wss = new SocketServer({server});

wss.on('connection', ws=> {
  console.log('Client connected');

  ws.on('close', ()=>{
    console.log(`Close connected`);
  });

  ws.on('message', (data)=>{
    console.log(`Client Data`, data);
    ws.send(data);
  });
});