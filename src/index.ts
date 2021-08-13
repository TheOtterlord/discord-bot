import { config } from 'dotenv'
import { App } from './app'

config()

const app = new App(process.env.TOKEN!)
app.start()

const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"]

events.forEach(event => {
  process.on(event, () => app.stop(event))
})
