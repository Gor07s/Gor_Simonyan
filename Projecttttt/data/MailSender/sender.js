const nodemailer = require('nodemailer');

async function sendMail(user,pass,from,to,subject,text) {
    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    await mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendMail }