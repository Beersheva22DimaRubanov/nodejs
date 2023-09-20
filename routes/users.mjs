import express from 'express';
import Joi from 'joi'
import { validate } from '../middlewear/validation.mjs';
import UserService from '../service/UserService.mjs';
import asyncHandler from 'express-async-handler'
import authVerification from '../middlewear/authVerification.mjs';
import valid from '../middlewear/valid.mjs';

export const users = express.Router();

const userService = new UserService()
const schema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  roles: Joi.array().items(Joi.string().valid('ADMIN', 'USER'))
})
users.use(validate(schema));
users.post('', authVerification("ADMIN_ACCOUNTS"), valid,  asyncHandler(
  async (req, res) => {
    if (!req.validated) {
      res.status(500);
      throw ("This api requires validation")
    }
    if (req.joiError) {
      res.status(400)
      throw (req.joiError);
    }
    const accountRes = await userService.addAccount(req.body);
    if (accountRes == null) {
      res.status(400);
      throw `account ${req.body.username} already exists`
    }
    res.status(201).send(accountRes);
  })
);

users.get("/:username", authVerification("ADMIN_ACCOUNTS", "ADMIN", "USER"), asyncHandler(
  async (req, res) => {
    const username = req.params.username;
    const account = await userService.getAccount(username);
    if (!account) {
      res.status(400);
      throw `account ${username} not found`
    }
    res.send(account);
  }
));

users.post("/login", asyncHandler(
  async (req, res) => {
    const loginData = req.body;
    const accessToken = await userService.login(loginData);
    if(!accessToken){
      res.status(400);
      throw 'Wrong credentials'
    }
    res.send({accessToken});
  }
));