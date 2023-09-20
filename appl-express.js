import bodyParser from 'body-parser'
import express from 'express'
import {users} from './routes/users.mjs'
import morgan from 'morgan'
import errorHandler from './middlewear/errorHandler.mjs';
import config from 'config';
import auth from './middlewear/auth.mjs';
import cors from'cors'
import {employees} from './routes/employees.mjs'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(auth);
app.use('/employees', employees)
app.use('/users', users);
const port = process.env.PORT || config.get('server.port')
const server = app.listen(port)
server.on("listening", ()=>console.log(`server is listening on ${server.address().port}`))
app.use(errorHandler);
