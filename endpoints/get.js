import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import Responses from '../libs/apiResponses-lib';

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      referralId: event.pathParameters.id,
    }
  };

  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    return Responses._404({message: "Item not found."});
  }

  // Return the retrieved item as a 200 response
  return Responses._200(result.Item);
});
