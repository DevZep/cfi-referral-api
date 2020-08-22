export default {
  _200(data = {}) {
      return {
          statusCode: 200,
          body: data,
      };
  },

  _400(data = {}) {
      return {
          statusCode: 400,
          body: data,
      };
  },

  _404(data = {}) {
    return {
        statusCode: 404,
        body: data,
    };
  },
};