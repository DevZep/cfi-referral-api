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

  // check the email exists in a list of whitelisted email addresses to send to
  let whitelist = process.env.toEmails.split(',');
  if(!whitelist.includes(referral.orgemail)) { throw({message: `Email ${referral.orgemail} not whitelisted`}); };

  // oscar domains
  let oscarDomains = ['demo','dc'];
  let selectedOscarDomain = oscarDomains[whitelist.indexOf(referral.orgemail)];

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
            <li>Location: ${referral.location}</li>
          </ul>
          <p>Open OSCaR
            <a href='http://${selectedOscarDomain}.oscarhq-staging.com/clients/new'>OSCaR</a>
          </p>`
    ;

    // If a lat and lon value are available then include a link to a map
    if(referral.lat && referral.lon) {
      htmlBody = `${htmlBody}
      <p>Open Location on
        <a href='https://maps.google.com/maps?q=${referral.lat},${referral.lon}'>Map</a>
      </p>`;
    }

    // Close out the body and html tag
    htmlBody = htmlBody + '</body></html>';

    // set the text body
    textBody = `Name: ${referral.name}\nPhone: ${referral.phone}\nNote: ${referral.note}\nDOB: ${referral.dob}\nGender: ${referral.gender}\nLocation: ${referral.location}\nLat: ${referral.lat}\nLon: ${referral.lon}`;

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