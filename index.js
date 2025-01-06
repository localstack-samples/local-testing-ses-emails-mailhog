const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');

const ses = new SESClient({
  region: 'us-east-1',
});

const ssm = new SSMClient({
  region: 'us-east-1',
});

exports.handler = async (event) => {
  const getEmailParams = {
    Names: ['/email/recipient', '/email/sender'],
    WithDecryption: true,
  };

  let emailAddresses;
  try {
    const command = new GetParametersCommand(getEmailParams);
    const response = await ssm.send(command);
    const recipientEmail = response.Parameters.find(param => param.Name === '/email/recipient')?.Value;
    const senderEmail = response.Parameters.find(param => param.Name === '/email/sender')?.Value;

    if (!recipientEmail || !senderEmail) {
      throw new Error('Email addresses not found in SSM parameters');
    }

    emailAddresses = { recipientEmail, senderEmail };
  } catch (error) {
    console.error('Error fetching emails from SSM', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve email addresses from SSM' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const { name, email, rating, question2, question3, question4 } = body;

  const emailContent = `
    You have received new feedback:

    ${name ? `Name: ${name}\n` : ''}
    ${email ? `Email: ${email}\n` : ''}
    Rating: ${rating}/5
    What did you like most about our service? ${question2}
    What can we improve? ${question3}
    Would you recommend us to others? ${question4}
  `;

  const sendEmailParams = {
    Destination: {
      ToAddresses: [emailAddresses.recipientEmail],
    },
    Message: {
      Body: {
        Text: { Data: emailContent },
      },
      Subject: { Data: 'New Feedback Submission' },
    },
    Source: emailAddresses.senderEmail,
  };

  try {
    const command = new SendEmailCommand(sendEmailParams);
    await ses.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback submitted successfully' }),
    };
  } catch (error) {
    console.error('Error sending email', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to send email: ${error.message}` }),
    };
  }
};
