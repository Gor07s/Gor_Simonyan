const data = require('../models/data');
const vars = require('../models/vars');
const recipients = require('../models/recipients');
const bodyParser = require('body-parser');
const express = require('express');
const sequelize = require('../models/index');
const { getWords } = require('../Middlewares/middleware')
const { sendMail } = require('../MailSender/sender')

sequelize.sync();

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

async function ModTemplates (req, res) {
    await data.update({
            templateName: req.body.templateName,
            templateText: req.body.templateText,
            templateTitle: req.body.title,
            templateFrom: req.body.from},
        {where: {id: req.body.id}})
    vars.destroy({where : {tableId : req.body.id}})
    const words = getWords()
    await words.forEach(word => vars.create({
        tableId: req.body.id,
        varName: word
    })
        .then(table => table.save()))
    recipients.destroy({where: {tableId: req.body.id}})
    await req.body.recipient.forEach(rec => recipients.create({
            tableId: req.body.id,
            email: rec
        })
            .then(table => table.save())
    )
    data.findAll().then(table => res.send(table));
}

async function DeleteTemplates (req, res) {
    await data.destroy({where: {id: req.body.id}});
    data.findAll().then(table => res.send(table));
}

async function SendMail(req, res){
    if (typeof(req.body.text) === "string") {
        await sendMail(req.body.user, req.body.pass, req.body.from, req.body.to, req.body.subject, req.body.text)
    }
    else {
        for (let i = 0; i < req.body.to.length; i++){
            await sendMail(req.body.user, req.body.pass, req.body.from, req.body.to[i], req.body.subject, req.body.text[i])
        }
    }
    res.send("Message send!")
}

module.exports = { GetTemplates, AddTemplates, SendMail, DeleteTemplates, GetRecipients, GetVars, ModTemplates };