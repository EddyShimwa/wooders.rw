import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();

// Initialize API key
const apiKey = process.env.BREVO_API_KEY;
if (apiKey) {
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

export interface EmailData {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { email: string; name?: string };
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    const defaultSender = {
      email: process.env.BREVO_FROM_EMAIL || 'noreply@woodersrwanda.rw',
      name: 'Wooders Rwanda'
    };

    const email = {
      sender: emailData.sender || defaultSender,
      to: emailData.to,
      subject: emailData.subject,
      htmlContent: emailData.htmlContent,
    };

    const response = await apiInstance.sendTransacEmail(email);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};