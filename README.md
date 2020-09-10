# CFI Referral App Serverless API

This is the serverless API project for the CFI Referral App.

This project was put together using the [Serverless Guide](https://serverless-stack.com/chapters/what-is-serverless.html). Checkout the [Starter Project README](./starter/README.md) for details on Serverless in general.

## Internal Documentation

There is some internal / private documentation for the team working on this project [here](https://docs.google.com/document/d/17r14qeT_BnlF2dghZP9-Vj7s8D4Z9NPGjSRWnz6aAbQ/edit#).

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
sls info -s prod -v
```

### Print the compiled config file

Useful to verify that the `serverless.yml` is setup ok:

```
sls print
```

## Deployment

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