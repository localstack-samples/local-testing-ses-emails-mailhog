lstk aws ssm put-parameter --name /email/recipient --value "recipient@example.com" --type String

lstk aws ssm put-parameter --name /email/sender --value "sender@example.com" --type String

lstk aws ses verify-email-identity --email sender@example.com

zip -r function.zip index.js node_modules/          

lstk aws lambda create-function \
  --function-name feedbackFormHandler \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::000000000000:role/lambda-role

lstk aws lambda create-function-url-config \
  --function-name feedbackFormHandler \
  --auth-type NONE

FUNCTION_URL=$(lstk aws lambda get-function-url-config \
  --function-name feedbackFormHandler \
  --query FunctionUrl \
  --output text)
echo $FUNCTION_URL