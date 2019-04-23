import chalk from "chalk"

import pgPromise from "pg-promise"
const pgp = pgPromise({
  query(query) {
    // console.log(chalk.green(query.query))
    require("fs").writeFileSync("./asdasdasdasd", query.query)
  },
})
console.log(process.env.DATABASE_URL)
export const db = pgp(process.env.DATABASE_URL)
