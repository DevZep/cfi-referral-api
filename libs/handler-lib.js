export default function handler(lambda) {
  return async function (event, context) {
    let res, statusCode, body;

    try {
      // Run the Lambda
      res = await lambda(event, context);
      statusCode = res.statusCode;
      body = res.body;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}