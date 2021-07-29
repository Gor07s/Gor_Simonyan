const data = require('../models/data');
const vars = require('../models/vars');
const recipients = require('../models/recipients')
const bodyParser = require('body-parser');
const express = require('express');
const sequelize = require('../models/index');
const { getWords } = require('../Middlewares/middleware')
const { sendMail } = require('../MailSender/sender')

sequelize.sync({ force: true });

const app = express();

let id = 1

app.use(bodyParser.json());
app.use(bodyParser.raw());

async function GetTemplates (req, res) {
    data.findAll().then(table => res.send(table));
}

async function GetRecipients (req, res) {
    recipients.findAll().then(table => res.send(table));
}

async function GetVars (req, res) {
    vars.findAll().then(table => res.send(table));
}

async function AddTemplates (req, res) {
    await data.create({
            templateName: req.body.templateName,
            templateText: req.body.templateText,
            templateTitle: req.body.title,
            templateFrom: req.body.from
        })
        .then(table => table.save());
    const words = getWords()
    await words.forEach(word => vars.create({
            tableId: id,
            varName: word
    })
        .then(table => table.save()))
    await req.body.recipient.forEach(rec => recipients.create({
        tableId: id,
        email: rec
    })
        .then(table => table.save())
    )
    id++
    await vars.findAll().then(table => res.send(table));
}

async function PutTemplates (req, res) {
    await data.update({name: req.body.name}, {where: {id: req.body.id}});
    data.findAll().then(table => res.send(table));
}

async function DeleteTemplates (req, res) {
    await data.destroy({where: {id: req.body.id}});
    data.findAll().then(table => res.send(table));
}

async function SendMail(req, res){
    await sendMail(req.body.user,req.body.pass,req.body.from,req.body.to,req.body.subject,req.body.text)
    res.send("Message send!")
}

module.exports = { GetTemplates, AddTemplates, SendMail, DeleteTemplates, GetRecipients, GetVars };