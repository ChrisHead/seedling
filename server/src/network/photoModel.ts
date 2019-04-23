import { IUpdateDefinition, SQL, update } from "@cd2/es-qu-el"
import { db } from "../db"
import { fileProviders } from "../fileProviders"

export interface IPhoto {
  id: string
  provider: string
  data: string
  plant: {
    id: string
    name: string
  }
  status: "pending" | "processing" | "done"
  results: any
}

export function getPendingPhotos() {
  return db.any<IPhoto>(`
    SELECT
      *,
      (
        SELECT row_to_json("plants")
        FROM "plants"
        WHERE "plants"."id"="photos"."plantId"
      ) as "plant"
    FROM "photos"
    WHERE status='pending'
  `)
}

export async function updatePhoto(photo: IPhoto, changes: Partial<IPhoto>) {
  const set: IUpdateDefinition["set"] = {}
  if ("status" in changes) {
    set.status = changes.status
  }
  if ("results" in changes) {
    set.results = { [SQL.Json]: changes.results }
  }

  const sql = update({
    table: "photos",
    set,
    where: { id: photo.id },
  })
  await db.any(sql)
}

export async function loadImageForPhoto(photoId: string) {
  const row = await db.one(SQL`SELECT * FROM "photos" WHERE id=${photoId}`)
  const handler = fileProviders[row.provider]
  const stream = handler.retrieve(row.data)
  return stream
}
