# CFI Referral App Serverless API

This is the serverless API project for the CFI Referral App.

This project was put together using the [Serverless Guide](https://serverless-stack.com/chapters/what-is-serverless.html). Checkout the [Starter Project README](./starter/README.md) for details on Serverless in general.

## Internal Documentation

There is some internal / private documentation for the DevZep team working on this project [here](https://docs.google.com/document/d/17r14qeT_BnlF2dghZP9-Vj7s8D4Z9NPGjSRWnz6aAbQ/edit#).

## Introduction

It is a fairly basic API to create and fetch referrals.

## Testing

Locally test the API's using mock data that is available in this projects [mocks](./mocks) folder. The great thing about this is that the test run is local so does not affect your database.

For example, below is how to locally test the `create` function using some mocked data.

```
sls invoke local --f create --path mocks/create-event.json
sls invoke local --f count --path mocks/count-event.json
sls invoke local --f get --path mocks/get-event.json
sls invoke local --f sendEmail --path mocks/sendEmail-event.json
```

### Info

To get information about a particular stage:

```
sls info -s dev -v
```

### Print the compiled config file

Useful to verify that the `serverless.yml` is setup ok:

```
sls print
```

### Validate the configuration against AWS CloudFormation

For now, you will need to deploy to dev to see if the config has any CloudFormation template issues:

```
sls deploy -s dev
```

## Deployment

We are using [seed.run](https://seed.run) which autmatically deploys the project to the `dev` stage when we push changes to the `master` branch. The stages can be promoted to `stageing` and `production` via the seed.run app.

However, you can also deploy the app or individual functions using the `serverless` cli tool as follows.

Lets say you want to make a change to the `create` function. You can make the change locally, test locally and then deploy. The way to deploy a single function is as follows:

```
serverless deploy function --function create
```

To deploy the entire serverless application you can simply run (the `-v` switch shows the verbose CloudFormation output):

```
serverless deploy -v
```

To deploy to a specific stage pass the stage flag like so:

```
serverless deploy --stage dev
```

This will be neccessary if you change anything in the [serverless.yml](./serverless.yml) configuration such as adding a new API endpoint.

## Add Emails to Whitelist

This is sepcific to the setup of the app being developed by the [DevZep](www.devzep.com) team. To add a new email to the whitelist you will need to:

1. Log into [seed.run](https://seed.run)
1. Navigate to the [project settings](https://console.seed.run/devzep/cfi-referral-api/settings)
1. Select the stage that you want to configure. For example [dev](https://console.seed.run/devzep/cfi-referral-api/settings/stages/dev)
1. Scroll down and click 'Show ENV Variables'
1. The `TO_EMAILS` key contains the whitelisted emails that you can update.
1. Save the settings and enjoy!

Note you will also need to add the email to the [front end](https://github.com/DevZep/cfi-referral-client) of the application in `orgEmails.ts` file.

## Reset environemnts for testing

Sometimes you might want to delete all data and redeploy the entire stack. This is easy to do with serverless as follows (of course, you would **never do this in production**!)

```
serverless remove --stage dev
```

Now re deploy the stack.

```
serverless deploy --stage dev
```

Note you may get an error about not deleting an S3 bucket if it contains data. Usually you can go and delete directly from S3 console. You may also need to manyally `delete the cloud formation stack` before running this command.

Note you will need to update the local `.env` in the [CFI Referral client app](https://github.com/DevZep/cfi-referral-client) for local app development since the ids will have changed and also in the [Netify environemnt variables](https://docs.netlify.com/configure-builds/environment-variables/) for all the environments where they changed.

Now you can test in the `dev` environment with a clean DynamoDB and Cognito database.

## Configuring AWS Resources

The AWS Resources are configured under the [resources](./resources) directory. To add new resources or add new properties to existing resources refer to the [AWS CloudFormation resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html)

For example, I recently added a `PasswordPolicy` to the [`AWS::Cognito::UserPool`](./resources/cognito-user-pool.yml) resource and it turns out that it is necessary to put the `PasswordPolicy` under `Policies` key as identified in the [AWS::Cognito::UserPool CloudFormation Documention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html) AWS  So pay attention to these docs! :)

## Cognito - Set Users Password

To manually set a users password, use the following:

```
aws cognito-idp admin-set-user-password \
--user-pool-id the-user-pool-id \
--username the-username \
--password a-new-strong-password \
--permanent \
--profile default
```