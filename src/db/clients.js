const { neon, neonConfig } = require("@neondatabase/serverless");
const secrets = require("../lib/secrets");

async function getDbClient() {
  const dbUrl = await secrets.getDatabaseUrl();
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbUrl);
  return sql;
}

module.exports.getDbClient = getDbClient;
