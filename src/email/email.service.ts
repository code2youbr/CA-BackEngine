import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/sequelize';
import { EmailModel } from './email.model';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import { isMD5 } from 'validator';

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
      html: `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body style="margin: 0; padding: 0;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0;">
  <tr>
    <td align="center">
      <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px;">
        <tr>
          <td style="background-color: #e88b00; border-radius: 20px; padding: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="background-color: #ffffff; border-radius: 20px; padding: 20px; width: 100%; height: 200px;">
                  <span style="font-family: 'Comic Sans MS', 'Arial', sans-serif; color: #E88B00FF; font-size: 60px; position: relative; top: -30px;">
                    Delicias Caseiras Tia nana
                  </span>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-family: Arial, sans-serif; font-size: 50px; color: #ffffff; padding: 10px; position: relative; top: -30px; left: -120px;">
                  Olá, ${accountAuth.accountUser.name}
                </td>
              </tr>
              <tr>
                <td align="center" style="font-family: Arial, sans-serif; font-size: 18px; color: #ffffff; padding: 10px;">
                  Use o código abaixo para trocar a senha da sua conta
                </td>
              </tr>
              <tr>
              <td align="center" style="padding: 20px;">
                <div style="background-color: #ffffff; border-radius: 20px; width: 300px; height: 100px; text-align: center; font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: 30px;">
                  <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" valign="middle">
                        ${recoveryKey}
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
              </tr>
              <tr>
                <td align="center" style="font-family: Arial, sans-serif; font-size: 18px; color: #ffffff; padding: 10px;">
                  Se você não solicitou esta troca, por favor ignore esta mensagem.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
    `,
    };


    try {
      const info = await this.transporter.sendMail(mailOptions)

      if(info){
        const emailCode = await this.emailModel.findOne({ rejectOnEmpty: undefined, where: {accountAuthId: accountAuth.id}});
        if(!emailCode){
          await this.emailModel.create({
            recovery_key: recoveryKey,
            accountAuthId: accountAuth.id
          })
          return
        }
        await emailCode.update({
          recovery_key: recoveryKey,
        })
        return
      }
    } catch (error) {
      console.error('Error sending email: ' + error);
    }

  }

  async verifyCode(accountAuth: AccountAuthModel, refactorCode): Promise<boolean> {
    const code = await this.emailModel.findOne({
      rejectOnEmpty: undefined,
      where: { recovery_key: refactorCode, accountAuthId: accountAuth.id },
    });
    if(code){
      return true;
    }
  }

  async deprecateCode(accountAuthId: number): Promise<void> {
    const recoveryCode = await this.emailModel.findOne({rejectOnEmpty: undefined,where: {accountAuthId: accountAuthId}});

    if(recoveryCode){
      await recoveryCode.update({
        recovery_key: null,
      })
    }

  }

  //creates a code of 6 random numbers
  generateVerificationCode(): number {
    const randomBytes = crypto.randomBytes(2);
    return  randomBytes.readUIntBE(0, 2)
  }
}
