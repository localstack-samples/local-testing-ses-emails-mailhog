const { LambdaClient, GetFunctionUrlConfigCommand } = require('@aws-sdk/client-lambda');
const axios = require('axios');

const lambdaClient = new LambdaClient({
  endpoint: 'http://localhost.localstack.cloud:4566',
  region: 'us-east-1',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

describe('Lambda Function Email Delivery via LocalStack', () => {
  let lambdaUrl;

  beforeAll(async () => {
    const command = new GetFunctionUrlConfigCommand({ FunctionName: 'feedbackFormHandler' });
    const response = await lambdaClient.send(command);
    lambdaUrl = response.FunctionUrl;
  });

  test('should send an email using LocalStack SES and Lambda function URL', async () => {
    const payload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      rating: 5,
      question2: 'Great service!',
      question3: 'Nothing much to improve',
      question4: 'Yes',
    };

    const response = await axios.post(lambdaUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Feedback submitted successfully');

    const sesMessagesResponse = await axios.get('http://localhost.localstack.cloud:4566/_aws/ses');

    const sesMessages = sesMessagesResponse.data.messages;

    const latestMessage = sesMessages.find((message) => {
      return message.Body.text_part.includes('John Doe') &&
        message.Body.text_part.includes('Great service!') &&
        message.Body.text_part.includes('Nothing much to improve') &&
        message.Body.text_part.includes('Yes');
    });

    expect(latestMessage).toBeDefined();
    expect(latestMessage.Body.text_part).toContain('John Doe');
    expect(latestMessage.Body.text_part).toContain('Great service!');
    expect(latestMessage.Body.text_part).toContain('Nothing much to improve');
    expect(latestMessage.Body.text_part).toContain('Yes');
  });
});
