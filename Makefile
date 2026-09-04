export AWS_ACCESS_KEY_ID ?= test
export AWS_SECRET_ACCESS_KEY ?= test
export AWS_DEFAULT_REGION ?= us-east-1

usage:       ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

check:       ## Check if all required prerequisites are installed
	@command -v docker > /dev/null 2>&1 || { echo "Docker is not installed. Please install Docker and try again."; exit 1; }
	@command -v node > /dev/null 2>&1 || { echo "Node.js is not installed. Please install Node.js and try again."; exit 1; }
	@command -v aws > /dev/null 2>&1 || { echo "AWS CLI is not installed. Please install AWS CLI and try again."; exit 1; }
	@command -v lstk > /dev/null 2>&1 || { echo "lstk is not installed. Please install lstk and try again."; exit 1; }
	@command -v zip > /dev/null 2>&1 || { echo "zip is not installed. Please install zip and try again."; exit 1; }
	@echo "All required prerequisites are available."

install:     ## Install dependencies and prepare environment
	@echo "Installing dependencies..."
	@cd feedback-survey-frontend
	@npm install
	@echo "Dependencies installed."

deploy-backend: ## Deploy backend resources (SSM, Lambda, and SES)
	@echo "Deploying backend resources..."
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
	@echo "Backend resources deployed successfully."

deploy-frontend: ## Build and serve the frontend application
	@echo "Building frontend application...";
	@cd feedback-survey-frontend && npm run build
	lstk aws s3 mb s3://webapp
	@cd feedback-survey-frontend && lstk aws s3 sync --delete ./build s3://webapp
	lstk aws s3 website s3://webapp --index-document index.html --error-document index.html
	@echo "Frontend application deployed."
	@echo "Access the application at: http://webapp.s3-website.localhost.localstack.cloud:4566/"

run:         ## Fetch Lambda function URL and display it
	@echo "Fetching Lambda Function URL..."
	FUNCTION_URL=$$(lstk aws lambda get-function-url-config \
		--function-name feedbackFormHandler \
		--query FunctionUrl \
		--output text)
	@echo "Lambda Function URL: $$FUNCTION_URL"

start:       ## Start LocalStack
	@test -n "${LOCALSTACK_AUTH_TOKEN}" || (echo "LOCALSTACK_AUTH_TOKEN is not set. Find your token at https://app.localstack.cloud/workspace/auth-token"; exit 1)
	@echo "Starting LocalStack..."
	@LOCALSTACK_AUTH_TOKEN=$(LOCALSTACK_AUTH_TOKEN) lstk start
	@echo "LocalStack started."


stop:        ## Stop LocalStack
	@echo "Stopping LocalStack..."
	lstk stop
	@echo "LocalStack stopped."

logs:        ## Retrieve LocalStack logs
	@lstk logs > logs.txt
	@echo "Logs saved to logs.txt."

clean:       ## Clean up resources
	@echo "Cleaning up resources..."
	lstk aws lambda delete-function --function-name feedbackFormHandler || true
	lstk aws s3 rb s3://webapp --force || true
	rm -f function.zip
	@echo "Resources cleaned."

.PHONY: usage check install deploy-backend deploy-frontend run start stop logs clean
