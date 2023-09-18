import http from 'node:http';
import config from 'config';
import {URL} from 'node:url';
import RouterDocText from './routes/Router.js';
import DocTextView from './view/DocTextView.js';

const SERVER_PORT = 'server.port'
const server = http.createServer();
const port = process.env.PORT || config.has(SERVER_PORT) && config.get(SERVER_PORT) || 0;
server.listen(port, () => console.log(`server listening on port ${server.address().port}`));

const router = new RouterDocText(server);
const docTextView = new DocTextView();
server.on('request', (req, response) => {
  response.setHeader('content-type', 'text/html')
  const request = new URL(`http://${req.headers.host}${req.url}`);
  if(!router.getRoutes().includes(request.pathname)){
    docTextView.renderError(request.pathname + " unknown operation", response);
    return;
  }
  
  console.log(`request type: ${request.pathname}`)
  server.emit(request.pathname, request.searchParams, response);
})





