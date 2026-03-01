import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class NotificationsService {
  private transporter;
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               Helper S3                                   */
  /* -------------------------------------------------------------------------- */

  private async getTemplateFromS3(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: 'dey-email-templates-v2',
      Key: key,
    });

    const response = await this.s3.send(command);

    if (!response.Body) {
      throw new Error(`Template ${key} not found in S3`);
    }

    return await response.Body.transformToString();
  }

  /* -------------------------------------------------------------------------- */
  /*                           Verification Emails                              */
  /* -------------------------------------------------------------------------- */

  async enviarCorreoSegunRespuesta(
    response: boolean,
    emailAddress: string,
    names: string,
  ): Promise<void> {
    try {
      // Template local welcome
      const templatePath = path.join(
        __dirname,
        '../../../templates/verificationProgrees.html',
      );
      const htmlWelcome = fs.readFileSync(templatePath, 'utf8');

      await this.sendEmail(
        emailAddress,
        'Terminos y condiciones dey 🎉',
        '¡Bienvenido! 😊',
        htmlWelcome
          .replace('[USERNAME]', names || '')
          .replace('[DATE]', new Date().toLocaleDateString()),
      );

      if (response) {
        const htmlApproved = fs.readFileSync(
          path.join(__dirname, '../../../templates/approvedVerification.html'),
          'utf8',
        );

        await this.sendEmail(
          emailAddress,
          'Verificación Aprobada 🎉',
          '¡Bienvenido! 😊',
          htmlApproved.replace('[username]', names || ''),
        );
      } else {
        const htmlRejected = fs.readFileSync(
          path.join(
            __dirname,
            '../../../templates/verificationRejected.html',
          ),
          'utf8',
        );

        await this.sendEmail(
          emailAddress,
          'Verificación Rechazada ❌',
          'Lo sentimos 😔',
          htmlRejected.replace('[username]', names || ''),
        );
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  OTP                                       */
  /* -------------------------------------------------------------------------- */

  async sendOtp(data: {
    email: string;
    code: string;
    username?: string;
  }): Promise<void> {
    try {
      const template = await this.getTemplateFromS3('sendOtp.html');

      const html = template
        .replace('{{1}}', data.code.charAt(0))
        .replace('{{2}}', data.code.charAt(1))
        .replace('{{3}}', data.code.charAt(2))
        .replace('{{4}}', data.code.charAt(3))
        .replace('{{5}}', data.code.charAt(4))
        .replace('{{6}}', data.code.charAt(5))
        .replace('{{username}}', data.username || '');

      await this.sendEmail(
        data.email,
        'Codigo de verificación dey',
        '¡No compartas tu código con nadie!',
        html,
      );
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  async sendOtpRecover(data: {
    email: string;
    code: string;
    username?: string;
  }): Promise<void> {
    try {
      const template = await this.getTemplateFromS3('sendOtpRecover.html');

      const html = template
        .replace('{{1}}', data.code.charAt(0))
        .replace('{{2}}', data.code.charAt(1))
        .replace('{{3}}', data.code.charAt(2))
        .replace('{{4}}', data.code.charAt(3))
        .replace('{{5}}', data.code.charAt(4))
        .replace('{{6}}', data.code.charAt(5))
        .replace('{{username}}', data.username || '');

      await this.sendEmail(
        data.email,
        '🔐 Tu código de verificación para recuperar tu contraseña',
        '¡No compartas tu código con nadie!',
        html,
      );
    } catch (error) {
      console.error('Error sending OTP recovery:', error);
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                Base Email                                  */
  /* -------------------------------------------------------------------------- */

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    return this.transporter.sendMail({
      from: 'gabriel.t@dey.mx',
      to,
      subject,
      text,
      html,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Email with PDF                                */
  /* -------------------------------------------------------------------------- */

  async sendMailWithAttachment(
    email: string,
    name: string,
    pdfBuffer: Buffer,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: 'gabriel.t@dey.mx',
        to: email,
        subject: 'Estado de Cuenta Dey',
        text: `Hola ${name}, adjunto tu estado de cuenta.`,
        html: `<p>Hola ${name},</p><p>Adjunto tu estado de cuenta en formato PDF.</p>`,
        attachments: [
          {
            filename: 'estado-cuenta.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      console.log('Correo enviado con PDF adjunto');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }
}
