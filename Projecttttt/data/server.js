const express = require('express');
const router = require('./Routes/router');
const cors = require('cors')

const fs = require('fs');

const app = express();

fs.readFileSync("./DataBase/database.sql");
app.use(cors())
app.use('/', router);

app.listen(8081);