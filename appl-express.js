import bodyParser from 'body-parser'
import express from 'express'
import {users} from './routes/users.mjs'
import morgan from 'morgan'
import errorHandler from './middlewear/errorHandler.mjs';

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/users', users);
const server = app.listen(8080)
server.on("connect", ()=>console.log(`server is listening on ${server.address().port}`))
app.use(errorHandler);
