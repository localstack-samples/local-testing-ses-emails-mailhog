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

- [`localstack` CLI](https://docs.localstack.cloud/) with [LocalStack Auth Token](https://docs.localstack.cloud/getting-started/auth-token/)
- [Node.js](https://nodejs.org/) & `npm`
- [Docker](https://docs.docker.com/get-docker/)
- [`awslocal`](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal)
- [`zip`](https://www.7-zip.org/)

## Installation

Run the following command to set up the environment and deploy resources:

```bash
make install
```

## Configure the MailHog Extension

MailHog is an open-source email testing tool that works with LocalStack to emulate SES email delivery and provides a web UI to inspect sent emails.

To install the MailHog extension, run the following command:

```bash
localstack extensions install localstack-extension-mailhog
```

Make sure that the LocalStack Auth Token is set in the environment.

## Start LocalStack

Start LocalStack with the MailHog extension enabled:

```bash
make start`
```

Make sure that the LocalStack Auth Token is set in the environment.

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
