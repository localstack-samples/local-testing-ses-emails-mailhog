const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: process.env.AWS_ENDPOINT_URL || 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
});

exports.handler = async (event) => {
  const ses = new AWS.SES();

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const {
    name,
    email,
    rating,
    question2,
    question3,
    question4,
  } = body;

  // Construct the email content
  const emailContent = `
    You have received new feedback:

    ${name ? `Name: ${name}\n` : ''}
    ${email ? `Email: ${email}\n` : ''}
    Rating: ${rating}/5
    What did you like most about our service? ${question2}
    What can we improve? ${question3}
    Would you recommend us to others? ${question4}
  `;

  const params = {
    Destination: {
      ToAddresses: ['recipient@example.com'], // Replace with your email
    },
    Message: {
      Body: {
        Text: { Data: emailContent },
      },
      Subject: { Data: 'New Feedback Submission' },
    },
    Source: 'sender@example.com', // Replace with your verified SES email
  };

  try {
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback submitted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to send email: ${error.message}` }),
    };
  }
};
