const express = require('express');
const func = require('../Controllers/controller');
const { check, getWords } = require('../Middlewares/middleware');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.post('/test', check, function (req, res){
    console.log(getWords())
    res.send(getWords())
});

router.post('/addTemplate', check, func.AddTemplates);

router.get('/useTemplate/templates', func.GetTemplates);
router.get('/useTemplate/recipients', func.GetRecipients);
router.get('/useTemplate/vars', func.GetVars);

router.post('/useTemplate/send', func.SendMail);

router.delete('/useTemplate', check, func.DeleteTemplates);

module.exports = router;