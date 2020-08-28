import handler from "../libs/handler-lib";
import Responses from '../libs/apiResponses-lib';
import dynamoDb from "../libs/dynamodb-lib";
import nodemailer from 'nodemailer';
const AWS = require('aws-sdk');
const SES = new AWS.SES();
const S3 = new AWS.S3();
let textBody, htmlBody, attachments;

export const main = handler(async (event, context) => {
  const { referralId } = JSON.parse(event.body);

  if (!referralId) {
    return Responses._400({
      message: 'referralId is required in the body'
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
    // set the html body
    htmlBody = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <h3>There is a new referral</h3>
          <ul>
            <li>Name: ${referral.name}</li>
            <li>Phone: ${referral.phone}</li>
            <li>Note: ${referral.note}</li>
            <li>DOB: ${referral.dob}</li>
            <li>Gender: ${referral.gender}</li>
          </ul>
        </body>
      </html>
    `;

    // set the text body
    textBody = `Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\nDOB: ${referral.dob}\nGender: ${referral.gender}`;

    attachments = [];

    if(referral.photo) {
      const paramsS3 = {
        Bucket: process.env.s3BucketAttachments,
        Key: `private/${referral.userId}/${referral.photo}`
       };

      const fileData = await S3.getObject(paramsS3).promise();
      attachments = [
        {
          filename: referral.photo,
          content: fileData.Body
        }
      ];
    }
  }

  var mailOptions = {
    to: process.env.toEmails.split(' '),
    from: process.env.fromEmail,
    subject: `New referral: ${referralId}`,
    html: htmlBody,
    text: textBody,
    attachments: attachments
  };

  if(process.env.stage !== 'prod') {
    mailOptions.subject = `[SEND FROM ${process.env.stage} ENVIRONMENT] - ${mailOptions.subject}`;
    mailOptions.to = `${process.env.stage}-cfi-referral-app@devzep.com`;
  }

  // create Nodemailer SES Transporter
  var transporter = nodemailer.createTransport({
    SES: SES
  });

  // send email via the nodemailer transporter
  await transporter.sendMail(mailOptions);

  return Responses._200({message: 'Email sent successfully!'});
});