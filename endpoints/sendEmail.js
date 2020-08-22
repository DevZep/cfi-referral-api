import handler from "../libs/handler-lib";
import Responses from '../libs/apiResponses-lib';
const AWS = require('aws-sdk');
const SES = new AWS.SES();

export const main = handler(async (event, context) => {
  // console.log(event);
  const { to, from, subject, text } = JSON.parse(event.body);

  if (!to || !from || !subject || !text) {
    return Responses._400({
      message: 'to, from, subject and text are all required in the body',
    });
  }

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

  await SES.sendEmail(params);
  return Responses._200({message: 'Check yer email!'});
});