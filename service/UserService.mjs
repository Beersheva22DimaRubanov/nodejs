import MongoConnection from "../domain/MongoConnection.mjs";
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'

const MONGO_ENV_URI = 'mongodb.env_uri';
const MONGO_DB_NAME = 'mongodb.db';
const ENV_JWT_SECRET = 'jwt.env_secret';
export default class UserService{
  #collection;
  
  constructor(){
    const connection_string = process.env[config.get(MONGO_ENV_URI)]
    const dbName = config.get(MONGO_DB_NAME);
    const connection = new MongoConnection(connection_string, dbName);
    this.#collection = connection.getCollection('accounts');
  }

  async addAccount(account){
    const accountDB = await toAccountDB(account)
    try{
      await this.#collection.insertOne(accountDB);
    }catch(error){
      if(error.code == 11000){
        account = null;
      }else{
        throw error;
      }
    }
    return account;
  }

  toAccount(accountDB){
    const res = {username: accountDB._id, roles: accountDB.roles, passwordHash: accountDB.passwordHash};
    delete res._id;
    return res;
  }

  async getAccount(username){
    const document = await this.#collection.findOne({_id: username});
    return document == null ? null : this.toAccount(document);
  }

  async login(loginData){
    const account = await this.getAccount(loginData.username);
    let accessToken;
    if(account && await bcrypt.compare(loginData.password, account.passwordHash)){
      accessToken = getJwt(account.username, account.roles)
    }
    return accessToken;
  }
}

function getJwt(username, roles){
  return jwt.sign({roles}, process.env[config.get(ENV_JWT_SECRET)], {
    expiresIn: config.get('jwt.expiresIn'),
    subject: username
  })
}

async function toAccountDB(account){
  const passwordHash = await bcrypt.hash(account.password, 10);
    const res = {_id: account.username, passwordHash, roles: account.roles}
    return res;
}