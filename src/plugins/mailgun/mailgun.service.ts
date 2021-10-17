import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { SendEmailInput } from './dto/send-email-Input.dto';

export class MailgunService {
  static async sendEmail(sendEmailInput: SendEmailInput): Promise<void> {
    const { subject } = sendEmailInput;

    const enviroment = process.env.NODE_ENV || 'local';

    const subjectTo =
      enviroment === 'production' ? subject : `${enviroment} | ${subject}`;

    const mailgun = new Mailgun(FormData);

    try {
      const mg = mailgun.client({
        username: 'api',
        key: <string>process.env.MAILGUN_PRIVATE_KEY
      });

      const msg = await mg.messages.create(<string>process.env.MAILGUN_DOMAIN, {
        from: sendEmailInput.from,
        to: sendEmailInput.to,
        subject: subjectTo,
        text: sendEmailInput.text,
        html: sendEmailInput.html
      });

      console.log(`${JSON.stringify(msg)}`);
    } catch (e) {
      console.log(`sendEmail: ${JSON.stringify(e)}`);
    }
  }
}
