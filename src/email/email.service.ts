import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/sequelize';
import { EmailModel } from '@app/email/email.model';
import { AccountAuthModel } from '@app/account-auth/account-auth.model';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService, @InjectModel(EmailModel) private emailModel: typeof EmailModel) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  logger = new Logger(EmailService.name);

  async sendRefactorCodeMail(to: string, accountAuth: AccountAuthModel): Promise<void> {
    const recoveryKey = this.generateVerificationCode()

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: to,
      subject: "Código para trocar sua senha",
      text: `Aqui está o seu código que permite trocar a senha \n               ${recoveryKey} \n\nse não foi você que pediu ignore esta mensagem`,
    };

    try {
      //const info = await this.transporter.sendMail(mailOptions);
      const info ="ok"
     // this.logger.log('Email send: ' + info.response);
        this.logger.log(JSON.stringify(accountAuth, null, 2));
      if(info){
        await this.emailModel.create({
          recovery_key: recoveryKey,
          accountAuthId: accountAuth.id
        })
      }
    } catch (error) {
      console.error('Error sending email: ' + error);
    }

  }

  //creates a code of 6 random numbers
  generateVerificationCode(): number {
    const randomBytes = crypto.randomBytes(3);
    return  randomBytes.readUIntBE(0, 3);
  }
}
