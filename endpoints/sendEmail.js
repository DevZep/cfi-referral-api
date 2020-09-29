import handler from "../libs/handler-lib";
import Responses from '../libs/apiResponses-lib';
import dynamoDb from "../libs/dynamodb-lib";
import nodemailer from 'nodemailer';
import * as emailLib from '../libs/email-lib';
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

  emailLib.setWhitelist(process.env.TO_EMAILS);

  // check the email exists in a list of whitelisted email addresses to send to
  emailLib.checkWhitelist(referral.orgemail);

  // oscar domains
  let oscarDomain = emailLib.selectOscarSubDomain(referral.orgemail);

  htmlBody = emailLib.renderHtml(referralId, referral, oscarDomain);
  textBody = emailLib.renderText(referralId, referral, oscarDomain);

  attachments = [];

  if(referral.photo) {
    const paramsS3 = {
      Bucket: process.env.s3BucketAttachments,
      Key: `private/${referral.userId}/${referral.photo}`
      };

    try {
      const fileData = await S3.getObject(paramsS3).promise();
      attachments = [
        {
          filename: referral.photo,
          content: fileData.Body
        }
      ];
    } catch(e) {
      console.error('Photo was not found in S3!');
    }
  }

  var mailOptions = {
    to: referral.orgemail,
    from: process.env.fromEmail,
    subject: `Client Referral: ${referralId.slice(0,8)}`,
    html: htmlBody,
    text: textBody,
    attachments: attachments
  };

  if(process.env.stage !== 'prod') {
    mailOptions.subject = `[${process.env.stage.toUpperCase()}] - ${mailOptions.subject}`;
  }

  // create Nodemailer SES Transporter
  var transporter = nodemailer.createTransport({
    SES: SES
  });

  // send email via the nodemailer transporter
  await transporter.sendMail(mailOptions);

  return Responses._200({message: 'Email sent successfully!'});
});