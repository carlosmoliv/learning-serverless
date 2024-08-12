const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const AWS_REGION = "us-east-1";
const STAGE = process.env.STAGE ?? "prod";

const DATABASE_URL_SSM_PARAM = `/serverless-nodejs/${STAGE}/database-url`;

async function getDatabaseUrl() {
  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData = {
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result.Parameter.Value;
}

module.exports.getDatabaseUrl = getDatabaseUrl;
