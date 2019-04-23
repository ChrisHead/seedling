import { config } from "dotenv"
config()

import { db } from "../src/db"
import { SQL } from "@cd2/es-qu-el"

async function run() {
  console.log("seeding")

  const plant = await db.one(SQL`
    INSERT INTO "plants" ("name", "body")
    VALUES (${"Apples"}, ${"An apple is a sweet, edible fruit produced by an apple tree (Malus pumila). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today. Apples have been grown for thousands of years in Asia and Europe and were brought to North America by European colonists. Apples have religious and mythological significance in many cultures, including Norse, Greek and European Christian traditions."})
    RETURNING id
  `)

  const diseases = [
    {
      name: "Apple scab",
      body:
        "Apple scab is a disease of Malus trees, such as apple trees, caused by the ascomycete fungus Venturia inaequalis. The disease manifests as dull black or grey-brown lesions on the surface of tree leaves,[1] buds or fruits. Lesions may also appear less frequently on the woody tissues of the tree. Fruits and the undersides of leaves are especially susceptible. The disease rarely kills its host, but can significantly reduce fruit yields and fruit quality. Affected fruits are less marketable due to the presence of the black fungal lesions.",
      treatment: `In affected orchards, new infections can be reduced by removing leaf litter and trimmings containing infected tissue from the orchard and incinerating them. This will reduce the amount of new ascospores released in the spring. Additionally, scab lesions on woody tissue can be excised from the tree if possible and similarly destroyed.`,
    },
    {
      name: "Cedar-apple rust",
      body:
        "Gymnosporangium juniperi-virginianae is a plant pathogen that causes cedar-apple rust.[1] In virtually any location where apples or crabapples (Malus) and Eastern red-cedar (Juniperus virginiana) coexist, cedar apple rust can be a destructive or disfiguring disease on both the apples and cedars. Quince and hawthorn are the most common host and many species of juniper can substitute for the Eastern red cedars.",
      treatment: `Because apples are an economically important crop, control is usually focused there. Interruption of the disease cycle is the only effective method for control of the cedar apple rust. The recommended method of control is to “remove cedars located within a 1 mile (1.6 km) radius” of the apples to interrupt the disease cycle,[4] though this method is seldom practical. For those doing bonsai, it is common to have the trees within feet of each other and on the central eastern seaboard of the United States, Eastern Red Cedar is a common first-growth conifer along roadsides.`,
    },
  ]

  const diseaseValues = diseases
    .map(disease => SQL`(${disease.name}, ${disease.body}, ${disease.treatment}, ${plant.id})`)
    .join()

  await db.any(SQL`
    INSERT INTO "diseases" ("name", "body", "treatment", "plantId")
    VALUES ${as => as.raw(diseaseValues)}
  `)

  await seedMapMarkers()
}

run().then(() => {
  process.exit(0)
})

import fetch from "node-fetch"

async function seedMapMarkers() {
  await getMarkers({
    query: "farm shop",
    type: "shop",
    extractData: result => ({
      name: result.name,
      place_id: result.place_id,
    }),
  })

  await getMarkers({
    query: "plant nursery",
    type: "nursery",
    extractData: result => ({
      name: result.name,
      place_id: result.place_id,
    }),
  })
  await getMarkers({
    query: "farm",
    type: "farm",
    extractData: result => ({
      name: result.name,
      place_id: result.place_id,
    }),
  })
}

async function getMarkers({ query, type, extractData = result => ({}) }) {
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBa1S8aL0_-Z5Uqqo9FgoKKSe_8Jovx4NE`
  const url = `${baseUrl}&location=52.7555011,-1.2102789&radius=500000&keyword=${query}`
  const nextPage = token => `${baseUrl}&pagetoken=${token}`

  let allResults = []
  let currentUrl = url

  while (currentUrl && allResults.length < 1000) {
    const { next_page_token, results } = await fetch(currentUrl).then(response => response.json())
    console.log(next_page_token)
    allResults = allResults.concat(results)
    if (next_page_token) {
      currentUrl = nextPage(next_page_token)
    } else {
      console.log("no page token")
      currentUrl = null
    }
  }

  const markers = allResults.map(result => {
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      type,
      data: extractData(result),
    }
  })

  const markerValues = markers
    .map(
      marker =>
        SQL`(${marker.latitude}, ${marker.longitude}, ${marker.type}, ${as =>
          as.json(marker.data)})`
    )
    .join()

  await db.any(SQL`
    INSERT INTO "markers" ("latitude", "longitude", "type", "data")
    VALUES ${as => as.raw(markerValues)}
  `)
}
