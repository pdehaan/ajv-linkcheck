module.exports = {
  $async: true,
  properties: {
    foo: {
      type: "string",
      format: "uri",
      checkLink: {},
      errorMessage: "URL isn't valid: ${0}"
    },
    bar: {
      type: "string",
      format: "uri",
      checkLink: {},
      errorMessage: "URL isn't valid: ${0}"
    }
  },
  required: ["foo", "bar"],
  additionalProperties: false
};
