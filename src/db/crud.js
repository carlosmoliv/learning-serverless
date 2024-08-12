const { eq } = require("drizzle-orm");
const client = require("./clients");
const schemas = require("./schemas");

async function saveLead({ email }) {
  const db = await client.getDrizzleDbClient();
  const result = await db
    .insert(schemas.leadTable)
    .values({ email })
    .returning();
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

async function findLeads() {
  const db = await client.getDrizzleDbClient();
  return db.select().from(schemas.leadTable);
}

async function findLeadById(id) {
  const db = await client.getDrizzleDbClient();
  const result = await db
    .select()
    .from(schemas.leadTable)
    .where(eq(schemas.leadTable.id, id));

  if (result.length === 1) {
    return result[0];
  }

  return null;
}

module.exports.saveLead = saveLead;
module.exports.findLeads = findLeads;
module.exports.findLeadById = findLeadById;
