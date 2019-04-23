import { config } from "dotenv"
config()

import { db } from "../src/db"
import { createTable, SQL } from "@cd2/es-qu-el"

// const createTable = createTable2 as any
async function run() {
  console.log("running")

  await db.any(`DROP SCHEMA "public" CASCADE`)
  await db.any(`CREATE SCHEMA "public"`)

  console.log("installing extensions")
  await db.any(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`)

  const basicCols = [
    {
      name: "id",
      type: "uuid",
      default: { [SQL.Raw]: "gen_random_uuid()" },
      primaryKey: true
    },
    {
      name: "createdAt",
      type: "timestamp",
      default: { [SQL.Raw]: "NOW()" },
      nullable: false
    }
  ]

  console.log(`Creating table: "plants"`)
  await db.any(
    createTable({
      name: "plants",
      ifNotExists: true,
      columns: [
        ...basicCols,
        { name: "name", type: "text", nullable: false, unique: true },
        { name: "body", type: "text", nullable: false }
      ]
    })
  )
  console.log(`Creating table: "diseases"`)
  await db.any(
    createTable({
      name: "diseases",
      ifNotExists: true,
      columns: [
        ...basicCols,
        { name: "name", type: "text", nullable: false },
        { name: "body", type: "text", nullable: false },
        { name: "treatment", type: "text", nullable: false },
        {
          name: "plantId",
          type: "uuid",
          nullable: false,
          references: { table: "plants", column: "id" }
        }
      ]
    })
  )
  console.log(`Creating table: "photos"`)
  await db.any(
    createTable({
      name: "photos",
      ifNotExists: true,
      columns: [
        ...basicCols,
        { name: "provider", type: "text", nullable: false, default: "local" },
        { name: "data", type: "text", nullable: false },
        { name: "isPublic", type: "boolean", nullable: false, default: false },
        // pending, processing, diseased, healthy
        { name: "status", type: "text", nullable: false, default: "pending" },
        { name: "latitude", type: "double precision" },
        { name: "longitude", type: "double precision" },
        { name: "results", type: "jsonb", default: "{}" },
        {
          name: "plantId",
          type: "uuid",
          nullable: false,
          references: { table: "plants", column: "id" }
        }
      ]
    })
  )

  console.log(`Creating table: "networks"`)
  await db.any(
    createTable({
      name: "networks",
      ifNotExists: true,
      columns: [
        ...basicCols,
        { name: "name", type: "text", nullable: false, unique: true },
        { name: "data", type: "json", nullable: false },
        { name: "labels", type: "text", nullable: false }
      ]
    })
  )

  console.log(`Creating table: "markers"`)
  await db.any(
    createTable({
      name: "markers",
      ifNotExists: true,
      columns: [
        ...basicCols,
        { name: "latitude", type: "double precision", nullable: false },
        { name: "longitude", type: "double precision", nullable: false },
        { name: "type", type: "text", nullable: false },
        { name: "data", type: "json", nullable: false, default: "{}" }
      ]
    })
  )
}

run().then(() => {
  process.exit(0)
})
