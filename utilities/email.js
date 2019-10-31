var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bearygoodconnections@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'bearygoodconnections@gmail.com',
  to: 'stelrq@uw.edu',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

export