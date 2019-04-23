import chalk from "chalk"
import pgPromise from "pg-promise"
const pgp = pgPromise({
  query(query) {
    console.log(chalk.green(query.query))
  },
})
export const db = pgp(process.env.DATABASE_URL)
