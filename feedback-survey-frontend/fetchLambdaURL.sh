#!/bin/bash

functionUrl=$(lstk aws lambda get-function-url-config --function-name feedbackFormHandler --query FunctionUrl --output text)

# Check if the function URL was fetched successfully
if [ $? -eq 0 ]; then
  # Write the function URL to the .env file
  echo "PREACT_APP_LAMBDA_URL=${functionUrl}" > .env
  echo "Lambda Function URL fetched and stored in .env file."
else
  echo "Error fetching Lambda Function URL."
  exit 1
fi
