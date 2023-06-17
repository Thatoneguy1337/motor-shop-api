import { createTransport } from "nodemailer";
import { IsendEmailResetPassword} from "../interfaces/resetEmail.interfaces";
import { AppError } from "../errors/errors";
import Mailgen from "mailgen";

class EmailService {
    async sendEmail({to,subject,text}: IsendEmailResetPassword){

        const trasnporter = createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        await trasnporter.sendMail({
            from: "motor.shop@kenzie.com.br",
            to,
            subject,
            html: text
        }).then(() => {
            console.log("Email send with sucess")
        }).catch((err) => {
            console.log(err)
            throw new AppError("Error sending email, try again later", 500)
        })

    }


    resetPasswordTemplate(userName:string, userEmail: string, resetToken: string){

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Motor-Shop-API',
                link: 'http://localhost:3000'        
               
            }
        });

        const email = {
            body: {
                name: userName,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#4529E6',
                        text: 'Reset your password',
                        link: `http://localhost:3000/resetPassword/${resetToken}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };

        const emailBody = mailGenerator.generate(email)
        const emailTemplate = {
            to: userEmail,
            subject: "Reset password",
            text: emailBody
        }

        return emailTemplate
    }
}

export const emailService = new EmailService()










