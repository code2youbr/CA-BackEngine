import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendRefactorCodeMail(to: string) {
    const recoveryKey = this.generateVerificationCode()

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: to,
      subject: "Código para trocar sua senha",
      text: `Aqui está o seu código que permite trocar a senha \n ${recoveryKey} \nse não foi você que pediu ignore esta mensagem`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email send: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
  }

  //creates a code of 6 random numbers
  generateVerificationCode(): string {
    return crypto.randomBytes(3).toString('hex');
  }
}
