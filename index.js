const promisify = require("util").promisify;

const Ajv = require("ajv");
const AjvErrors = require("ajv-errors");
const _linkCheck = require("link-check");

const schema = require("./schema");

const linkCheck = promisify(_linkCheck);

const brokenLinks = new Map();

const ajv = new Ajv({allErrors: true, jsonPointers: true});
ajv.addKeyword("checkLink", {
  async: true,
  type: "string",
  format: "uri",
  validate: async (schema, url) => {
    try {
      const result = await linkCheck(url);
      // Invalid domain.
      if (result.err) {
        throw result.err;
      }
      // Valid URL format, but non-200 response.
      if (result.statusCode !== 200) {
        const err = new Error(`Invalid URL, ${url}`);
        err.link = result.link;
        err.statusCode = result.statusCode;
        err.status = result.status;
        throw err;
      }
      return true;
    } catch (err) {
      brokenLinks.set(url, err);
      return false;
    }
  },
  errors: true
});

AjvErrors(ajv);

const validate = ajv.compile(schema);
const data = {
  foo: "http://bingsddsd.com/foo/bar",
  bar: "https://github.com/mozilla/testpilot/docs/README.md"
};

validate(data)
  .then(result => {
    console.log("success");
    console.log(result);
  })
  .catch(err => {
    console.error(err.message);

    for (const error of err.errors) {
      console.log(ajv.errorsText([error], {dataVar: "#"}));
    }

    process.exitCode = 1;
    // console.log(brokenLinks);
  });
