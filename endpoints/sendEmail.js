import handler from "../libs/handler-lib";
import Responses from '../libs/apiResponses-lib';
import dynamoDb from "../libs/dynamodb-lib";
const AWS = require('aws-sdk');
const SES = new AWS.SES();
let to, from, subject, textBody, htmlBody;

export const main = handler(async (event, context) => {
  const { referralId } = JSON.parse(event.body);

  if (!referralId) {
    return Responses._400({
      message: 'referralId is required in the body',
    });
  }

  const getParams = {
    TableName: process.env.tableName,
    Key: {
      referralId
    }
  };

  const result = await dynamoDb.get(getParams);
  const referral = result.Item;

  textBody = `Referral ${referralId} Not Found. Please Contact Support.`;
  htmlBody = `<!DOCTYPE html><html><head></head><body><b>${textBody}</b></body></html>`;

  if (referral) {
    htmlBody = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <h3>There is a new referral</h3>
          <ul>
            <li>Name: ${referral.name}</li>
            <li>Phone: ${referral.phone}</li>
            <li>Photo: ${referral.photo}</li>
            <li>Note: ${referral.note}</li>
            <li>DOB: ${referral.dob}</li>
          </ul>
        </body>
      </html>
    `;
    textBody = `Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\DOB: ${referral.dob}\nPhoto: ${referral.photo}`;
  }

  to = process.env.toEmails.split(' ');
  from = process.env.fromEmail;
  subject = `New referral: ${referralId}`;

  const emailParams = {
    Destination: {
        ToAddresses: to,
    },
    Message: {
        Body: {
            Text: { Data: textBody },
            Html: {
              Charset: 'UTF-8',
              Data: htmlBody,
            },
        },
        Subject: { Data: subject },
    },
    Source: from,
  };

  await SES.sendEmail(emailParams).promise();
  return Responses._200({message: 'Email sent successfully!'});
});