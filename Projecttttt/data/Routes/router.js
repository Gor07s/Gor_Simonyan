const express = require('express');
const func = require('../Controllers/controller');
const { check, getWords } = require('../Middlewares/middleware');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.post('/addTemplate', check, func.AddTemplates);

router.get('/useTemplate/templates', func.GetTemplates);
router.get('/useTemplate/recipients', func.GetRecipients);
router.get('/useTemplate/vars', func.GetVars);

router.post('/useTemplate/send', func.SendMail);

router.put('/useTemplate/modify', check, func.ModTemplates)

router.delete('/useTemplate/delete', func.DeleteTemplates);

module.exports = router;