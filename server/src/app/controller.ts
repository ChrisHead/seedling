import { SQL } from "@cd2/es-qu-el"
import { db } from "../db"
import { fileProviders } from "../fileProviders"

export const controller: Record<string, (data: any) => any> = {
  async wikiSearch({ query }) {
    return {
      plants: await db.any(
        SQL`SELECT * FROM "plants" WHERE "name" ILIKE '%${as => as.nonQuotedValue(query)}%'`
      ),
      diseases: await db.any(
        SQL`SELECT * FROM "diseases" WHERE "name" ILIKE '%${as => as.nonQuotedValue(query)}%'`
      ),
    }
  },
  wikiShowPlant({ id }) {
    return db.one(SQL`
      SELECT
        *,
        (
          SELECT json_agg("diseases")
          FROM "diseases"
          WHERE "diseases"."plantId"="plants"."id"
        ) as "diseases"
      FROM "plants"
      WHERE id=${id}
    `)
  },
  async wikiShowDisease({ id }) {
    return db.one(SQL`
      SELECT
        *,
        (
          SELECT row_to_json("plants")
          FROM "plants"
          WHERE "plants"."id"="diseases"."plantId"
        ) as "plant"
      FROM "diseases"
      WHERE id=${id}
    `)
  },
  async mapMarkers() {
    const markers = await db.any(SQL`SELECT * from "markers"`)
    const photos = await db.any(
      SQL`SELECT * FROM "photos" WHERE "isPublic"=true AND "latitude" IS NOT NULL`
    )
    const photoMarkers = photos.map(photo => ({
      id: `photo-${photo.id}`,
      type: "photo",
      data: { id: photo.id },
      latitude: photo.latitude,
      longitude: photo.longitude,
    }))
    return markers.concat(photoMarkers)
  },

  async photoCreate(data) {
    const { photo, isPublic, plantId, latitude, longitude } = data
    const providerName = process.env.FILE_PROVIDER
    console.log("provider name", providerName)
    const fileHandler = fileProviders[providerName || "local"]
    const reference = await fileHandler.store(photo)
    console.log(reference)
    return db.one(SQL`
      INSERT INTO "photos" ("provider", "data", "plantId", "isPublic", "latitude", "longitude")
      VALUES (${providerName}, ${reference}, ${plantId}, ${isPublic}, ${latitude ||
      null}, ${longitude || null})
      RETURNING id
      `)
  },
  async photoDestroy({ id }) {
    await db.any(SQL`DELETE FROM "photos" WHERE "id"=${id}`)
    return { ok: true }
  },
  photoShow({ id }) {
    return db.one(SQL`
      SELECT
        *,
        (
          SELECT row_to_json("plants")
          FROM "plants"
          WHERE "plants"."id"="photos"."plantId"
        ) as "plant"
      FROM "photos"
      WHERE id=${id}
    `)
  },
  async plantList() {
    return db.any(SQL`SELECT id, name FROM "plants"`)
  },
}
