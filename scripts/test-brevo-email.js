const brevo = require('@getbrevo/brevo');

require('dotenv').config({ path: '.env.local' });

async function testBrevoEmail() {
  try {
    console.log('Testing Brevo email delivery...');

    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    }

    // First, let's check account info
    console.log('Checking Brevo account status...');
    const accountApi = new brevo.AccountApi();
    accountApi.setApiKey(brevo.AccountApiApiKeys.apiKey, apiKey);

    try {
      const accountInfo = await accountApi.getAccount();
      console.log('✅ Brevo account connected successfully!');
      console.log('Account email:', accountInfo.body.email);
      console.log('Plan type:', accountInfo.body.plan?.type);
      console.log('Credits remaining:', accountInfo.body.plan?.credits);
    } catch (accountError) {
      console.log('❌ Brevo account check failed:', accountError.message);
      console.log('This might indicate an invalid API key or account issue.');
    }

    const emailData = {
      sender: {
        email: process.env.BREVO_FROM_EMAIL || 'noreply@wooders.rw',
        name: 'Wooders Rwanda Test'
      },
      to: [{
        email: process.env.BREVO_ADMIN_EMAIL || 'woodersrwanda@gmail.com',
        name: 'Test Recipient'
      }],
      subject: 'Brevo Test Email - ' + new Date().toISOString(),
      htmlContent: `
        <h2>Test Email from Brevo</h2>
        <p>This is a test email sent at ${new Date().toLocaleString()}</p>
        <p>If you receive this, Brevo integration is working correctly!</p>
        <p><strong>Check your spam/junk folder if you don't see it in your inbox.</strong></p>
      `
    };

    console.log('\nSending email...');
    console.log('API Key (first 10 chars):', process.env.BREVO_API_KEY?.substring(0, 10) + '...');
    console.log('From:', emailData.sender.email);
    console.log('To:', emailData.to[0].email);
    console.log('Subject:', emailData.subject);

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log('\n✅ Email sent successfully!');
    console.log('Response status:', response.response?.statusCode);
    console.log('Message ID:', response.body?.messageId);
    console.log('Full response:', JSON.stringify(response, null, 2));

    console.log('\n📧 If you don\'t receive the email:');
    console.log('1. Check your spam/junk folder');
    console.log('2. Verify the sender email is confirmed in Brevo dashboard');
    console.log('3. Check if your Brevo account has sending limits');
    console.log('4. Make sure the API key is correct and active');

  } catch (error) {
    console.error('\n❌ Error sending email:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    if (error.body) {
      console.error('Error body:', error.body);
    }

    console.error('Full error:', error);
  }
}

testBrevoEmail();