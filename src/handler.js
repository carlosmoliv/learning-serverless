const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");
const AWS = require("aws-sdk");

const AWS_REGION = "us-east-1";

const app = express();
const ssm = new AWS.SSM({ region: AWS_REGION });

const DATABASE_URL_SSM_PARAM = "/serverless-nodejs/prod/database-url";

async function dbClient() {
  const paramStoreData = await ssm
    .getParameter({
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    })
    .promise();

  neonConfig.fetchConnectionCache = true;
  const sql = neon(paramStoreData.Parameter.Value);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const results = await sql`select now();`;

  return res.status(200).json({
    message: "Hello from root!",
    results,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
