import { app } from "./app"
import { task as networkTask } from "./network"

const port = process.env.PORT
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))

if (process.env.NETWORK !== "false") {
  networkTask.start({ interval: 50000 })
}
