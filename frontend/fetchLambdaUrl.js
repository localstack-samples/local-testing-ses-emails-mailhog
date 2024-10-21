const { execSync } = require('child_process');
const fs = require('fs');

try {
  const functionUrl = execSync(
    'awslocal lambda get-function-url-config --function-name feedbackFormHandler --query FunctionUrl --output text'
  )
    .toString()
    .trim();

  fs.writeFileSync('.env', `PREACT_APP_LAMBDA_URL=${functionUrl}\n`);
  console.log('Lambda Function URL fetched and stored in .env file.');
} catch (error) {
  console.error('Error fetching Lambda Function URL:', error);
  process.exit(1);
}
