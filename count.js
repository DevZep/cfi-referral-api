import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.TABLE_NAME_COUNT,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    }
  };

  const result = await dynamoDb.get(params);

  // Return the row count for the query params
  return result;
});