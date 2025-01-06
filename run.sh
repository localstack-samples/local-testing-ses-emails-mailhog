awslocal ssm put-parameter --name /email/recipient --value "recipient@example.com" --type String

awslocal ssm put-parameter --name /email/sender --value "sender@example.com" --type String

awslocal ses verify-email-identity --email sender@example.com

zip -r function.zip index.js node_modules/          

awslocal lambda create-function \
  --function-name feedbackFormHandler \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::000000000000:role/lambda-role

awslocal lambda create-function-url-config \
  --function-name feedbackFormHandler \
  --auth-type NONE

FUNCTION_URL=$(awslocal lambda get-function-url-config \
  --function-name feedbackFormHandler \
  --query FunctionUrl \
  --output text)
echo $FUNCTION_URL