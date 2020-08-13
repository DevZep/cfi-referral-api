import * as getHandler from '../get';

test('GET referral', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await getHandler.main(event, context, callback);
});
