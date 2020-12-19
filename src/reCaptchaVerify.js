const axios = require("axios");
const qs = require("querystring");

/**
 * This function calls Google APIs to verify the reCaptcha response sent by frontend
 * @param {Object} options 
 * @param {string} captchaResponse 
 */
module.exports = async (options, captchaResponse) => {
  console.log({ ...options, response: captchaResponse })
  const x = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    qs.stringify({ ...options, response: captchaResponse })
  );
  return x;
};
