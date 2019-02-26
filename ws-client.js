const W3CWebSocket = require('websocket').w3cwebsocket;
const PORT = 3000 || Number(process.argv[1]);
let ws = new W3CWebSocket(`ws://localhost:3000/`,'echo-protocol');
ws.onerror = function(err) {
  console.log('Connection Error');
  console.log(err);
};
ws.onopen = () => {
  console.log(`ws-client open connection`);
  if (ws.readyState === ws.OPEN) {
    ws.send('test');
    ws.send('second');
    ws.send(JSON.stringify({key:'1'}));
    // ws.close();
  }
};

ws.onclose = () => {
  console.log(`ws-client close connection`);
};

ws.onmessage = event => {
  console.log(`ws-client `, event.data);
};
