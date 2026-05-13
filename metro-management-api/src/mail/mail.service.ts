import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTicketConfirmation(email: string, data: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Ticket Confirmation',
      template: 'ticket-confirmation',
      context: data,
    });
  }

  async sendPaymentSuccess(email: string, data: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Payment Successful',
      template: 'payment-success',
      context: data,
    });
  }

  async sendTicketCancelled(email: string, data: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Ticket Cancelled',
      template: 'ticket-cancelled',
      context: data,
    });
  }
}