const nodeMailer = require('nodemailer');
let SMPT_SERVICE = 'gmail' ;
let SMPT_MAIL = 'developerrajy@gmail.com' ;
let SMPT_PASSWORD = 'rajyrajy1' ;

const sendEmail = async (Options) =>{

    const transporter = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        service:SMPT_SERVICE,
        auth:{
            user:SMPT_MAIL,
            pass:SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from:'',
        to:Options.email,
        subject:Options.subject,
        text:Options.message
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail ;