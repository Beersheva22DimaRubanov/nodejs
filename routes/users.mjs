import express from 'express';
import Joi from 'joi'
import { validate } from '../middlewear/validation.mjs';
import UserService from '../service/UserService.mjs';
import config from 'config'

export const users = express.Router();

const userService = new UserService(process.env.ATLAS_URI_ACCOUNTS_TEST, config.get('mongodb.db'))
const  schema = Joi.object({
  username: Joi.string().alphanum().min(5).required(),
  password: Joi.string().min(5).required(),
  roles: Joi.array().items(Joi.string().valid('ADMIN', 'USER'))
})
users.use(validate(schema))
users.post('/sign-up', async (req, res) => {
  if (!req.validated) {
    res.status(500);
    throw("This api requires validation")
  } 
  if (req.joiError) {
    res.status(400)
   throw (req.joiError);
  }

  res.status(201).send(await userService.addAccount(req.body));
});