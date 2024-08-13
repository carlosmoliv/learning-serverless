const z = require("zod");

async function validateLead(postData) {
  const lead = z.object({
    email: z.string().email(),
  });

  let hasError;
  let validData = {};
  try {
    validData = lead.parse(postData);
    hasError = false;
    message = "";
  } catch (error) {
    hasError = true;
    message = "Invalid email";
  }

  return {
    data: validData,
    hasError,
    message,
  };
}

module.exports.validateLead = validateLead;
