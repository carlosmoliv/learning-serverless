const {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} = require("@aws-sdk/client-ssm");

const AWS_REGION = "us-east-1";
const STAGE = process.env.STAGE ?? "prod";

async function getDatabaseUrl() {
  const DATABASE_URL_SSM_PARAM = `/serverless-nodejs/${STAGE}/database-url`;
  console.log(DATABASE_URL_SSM_PARAM);

  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData = {
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result.Parameter.Value;
}

async function saveDatabaseUrl(stage, dbUrl) {
  const paramStage = stage ? stage : "dev";

  if (paramStage === "prod") return;

  const DATABASE_URL_SSM_PARAM = `/serverless-nodejs/${paramStage}/database-url`;

  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData = {
    Name: DATABASE_URL_SSM_PARAM,
    Value: dbUrl,
    Type: "SecureString",
    Overwrite: true,
  };

  const command = new PutParameterCommand(paramStoreData);
  const result = await client.send(command);

  return result;
}

module.exports.getDatabaseUrl = getDatabaseUrl;
module.exports.saveDatabaseUrl = saveDatabaseUrl;
