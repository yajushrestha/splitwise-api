var nodemailer = require('nodemailer');
var fs = require('fs');
var hb = require('handlebars');
require("dotenv").config();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
            throw err;

        }
        else {
            callback(null, html);
        }
    });
};
const sendEmail = (to, subject, link, name) => {
    readHTMLFile('./src/utils/template.html', function (err, html) {
        var template = hb.compile(html);
        var replacements = {
            link: link,
            name: name
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            attachments: [{
                filename: 'logo.png',
                path: './src/utils/logo.png',
                cid: 'logo'
            }],
            html: htmlToSend,
        }
        var resp;
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log('EMAIL ERROR', err);
                resp = false;
            } else {
                console.log('EMAIL SUCCESS', err);
                resp = true;
            }
        })
        return resp;
    });
}

export default sendEmail;
