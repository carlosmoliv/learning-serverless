const express = require("express");
const serverless = require("serverless-http");
const { getDbClient } = require("./db/clients");
const crud = require("./db/crud");
const validators = require("./db/validators");

const app = express();
app.use(express.json());

const STAGE = process.env.STAGE ?? "prod";

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();
  const [dbNowResult] = await sql`select now();`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;

  return res.status(200).json({
    message: "Hello from root!",
    delta,
    stage: STAGE,
  });
});

app.post("/leads", async (req, res, next) => {
  const postData = await req.body;
  const { data, hasError, message } = await validators.validateLead(postData);

  if (hasError) {
    return res.status(400).json({
      message: message ?? "Invalid request",
    });
  }

  const leads = await crud.saveLead(data);
  return res.status(201).json({ leads });
});

app.get("/leads", async (req, res, next) => {
  const leads = await crud.findLeads();
  return res.status(200).json({ leads });
});

app.get("/leads/:id", async (req, res, next) => {
  const lead = await crud.findLeadById(req.params.id);
  return res.status(200).json({ lead });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
