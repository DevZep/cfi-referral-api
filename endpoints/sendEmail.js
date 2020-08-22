import handler from "../libs/handler-lib";
import Responses from '../libs/apiResponses-lib';
const AWS = require('aws-sdk');
const SES = new AWS.SES();
let to, from, subject, text;

export const main = handler(async (event, context) => {
  const { referralId } = JSON.parse(event.body);

  if (!referralId) {
    return Responses._400({
      message: 'referralId is required in the body',
    });
  }

  to = 'darren.jensen@gmail.com';
  from = 'darren.jensen@devzep.com';
  subject = 'There is a new referral';
  text = `Referral ID: ${referralId}`;

  const params = {
    Destination: {
        ToAddresses: [to],
    },
    Message: {
        Body: {
            Text: { Data: text },
        },
        Subject: { Data: subject },
    },
    Source: from,
  };

  await SES.sendEmail(params).promise();
  return Responses._200({message: 'Check yer email!'});
});