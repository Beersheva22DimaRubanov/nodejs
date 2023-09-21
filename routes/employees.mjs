import express from "express";
import asyncHandler from 'express-async-handler'
import EmployeesService from "../service/EmployeesService.mjs";

import {validate}  from "../middlewear/validation.mjs";
import config from 'config'
import authVerification from "../middlewear/authVerification.mjs";
import Joi from 'joi'
import valid from "../middlewear/valid.mjs";

export const employees = express.Router();
const employeesService = new EmployeesService();

const {minId, maxId, minDate, maxDate, departments, minSalary, maxSalary} = config.get('employee');
const schema = Joi.object({
    id: Joi.number().min(minId).max(maxId),
    birthDate: Joi.date().iso().less(maxDate).greater(minDate).required(),
    name: Joi.string().required(),
    department: Joi.string().valid(...departments).required(),
    salary: Joi.number().min(minSalary).max(maxSalary).required(),
    gender: Joi.any().allow('male', 'female').required()
})
employees.use(validate(schema));

employees.post('',authVerification("ADMIN"), valid, asyncHandler(
    async (req, res) => {

        const employee = await employeesService.addEmployee(req.body);
        if (!employee && req.body.id) {
            res.status(400);
            throw `employee with id ${req.body.id} already exists`
        }
        if(req.wss){
            req.wss.clients.forEacg(client => client.send(JSON.stringify({op: 'add', data: employee})))
        }
        res.send(employee);
    }
))
employees.put('/:id',authVerification("ADMIN"), valid, asyncHandler(
    async (req, res) => {
        if (req.params.id != req.body.id) {
            res.status(400);
            throw `id in request parameter (${req.params.id}) doesn't match the id in employee object (req.body.id)`
        }
        const employee = await employeesService.updateEmployee(req.body);
        if (!employee) {
            res.status(404);
            throw `employee with id ${req.body.id} doesn't exist`
        }
        if(req.wss){
            req.wss.clients.forEacg(client => client.send(JSON.stringify({op: 'update', data: employee})))
        }
        res.send(employee);
    }
))
employees.delete('/:id',authVerification("ADMIN"), asyncHandler(
    async (req,res) => {
        if(!await employeesService.deleteEmployee(+req.params.id)) {
            res.status(404);
            throw `employee with id ${req.params.id} doesn't exist`
        }
        if(req.wss){
            req.wss.clients.forEacg(client => client.send(JSON.stringify({op: 'delete', data: id})))
        }
        res.send();
    }
))
 employees.get('', authVerification("ADMIN", "USER"),asyncHandler(
    async(req,res) => {
        const employees = await employeesService.getAllEmployees();
        res.send(employees);
    }
))
employees.get('/:id',authVerification("ADMIN", "USER"), asyncHandler(
   async (req, res) => {

    const employee = await employeesService.getEmployee(+req.params.id);
    if (!employee) {
        res.status(404);
        throw `employee with id ${req.params.id} doesn't exist`
    }
    res.send(employee)
   } 
))


