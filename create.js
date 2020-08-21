import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      referralId: uuid.v1(),
      userId: event.requestContext.identity.cognitoIdentityId,
      name: data.name,
      phone: data.phone,
      photo: data.photo,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});