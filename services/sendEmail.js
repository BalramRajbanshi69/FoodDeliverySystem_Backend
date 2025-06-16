// const nodemailer = require("nodemailer");

// exports.sendEmail = async(options)=>{
//     let transporter = nodemailer.createTransport({
//         service:"gmail",
//         auth:{
//             user:process.env.EMAIL_USER,
//             pass:process.env.EMAIL_PASS,
//         }
//     })

//     const mailOptions = {
//         from:"Balram Rajbanshi <balramrajbanshi4769@gmail.com>",
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }

//     await transporter.sendMail(mailOptions)
// }









const nodemailer = require("nodemailer");

exports.sendEmail = async(options)=>{
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from:"Balram Rajbanshi <balramrajbanshi4769@gmail.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    await transporter.sendMail(mailOptions);
};