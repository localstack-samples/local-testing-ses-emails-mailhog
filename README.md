# Local Testing of SES Workflows with LocalStack & MailHog

| Key          | Value                             |
| ------------ | --------------------------------- |
| Environment  | LocalStack                        |
| Services     | SES, SSM, Lambda                 |
| Integrations | MailHog Extension                 |
| Categories   | Serverless; Email Workflow Testing |

## Introduction

This project demonstrates how to locally test an SES-based email feedback workflow using LocalStack and the MailHog extension. It includes:

- A Lambda function that sends feedback emails using SES.
- SSM Parameter Store for securely storing sender and recipient email addresses.
- MailHog to intercept and review emails sent via SES for testing.

The workflow includes end-to-end local testing without requiring real AWS credentials.

## Prerequisites

- A valid [LocalStack for AWS license](https://localstack.cloud/pricing). Your license provides a [`LOCALSTACK_AUTH_TOKEN`](https://docs.localstack.cloud/aws/getting-started/auth-token/) to activate LocalStack.
- [`lstk`](https://docs.localstack.cloud/aws/developer-tools/running-localstack/lstk/), the LocalStack CLI. Install it with `npm install -g @localstack/lstk` or `brew install localstack/tap/lstk`.
- [Node.js](https://nodejs.org/) & `npm`
- [Docker](https://docs.docker.com/get-docker/)
- [AWS CLI](https://aws.amazon.com/cli/), required by `lstk aws`.
- [`zip`](https://www.7-zip.org/)

## Installation

Run the following command to set up the environment and deploy resources:

```bash
make install
```

## Configure the MailHog Extension

MailHog is an open-source email testing tool that works with LocalStack to emulate SES email delivery and provides a web UI to inspect sent emails.

`lstk` reads the container's environment variables from [`.lstk/config.toml`](.lstk/config.toml), which installs the `localstack-extension-mailhog` extension automatically on start.

Make sure that the LocalStack Auth Token is set in the environment.

## Start LocalStack

Start LocalStack with the MailHog extension enabled:

```bash
export LOCALSTACK_AUTH_TOKEN=<your-auth-token>
make start
```

## Deploy the backend resources

Deploy the Lambda function and SSM parameters:

```bash
make deploy-backend
```

## Deploy the frontend resources

Deploy the Preact app to collect feedback:

```bash
make deploy-frontend
```

Access the feedback form on the output URL. Access the MailHog UI at `https://mailhog.localhost.localstack.cloud:4566/` to view the emails sent by the Lambda function.

## License

This code is available under the Apache 2.0 license.
