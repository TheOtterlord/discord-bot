import { Client, Intents } from "discord.js"
import Logger from "paralogger"
import { Commands } from "./classes/commands"

export class App {
  bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  commands: Commands = new Commands(this)
  log: Logger = new Logger('bot', 'trace')

  started: boolean = false

  token: string

  constructor(token: string) {
    this.token = token
  }

  async start() {
    this.bot.on('ready', () => {
      this.log.info('Started bot')
      this.commands.register(`${__dirname}/commands`)
    })

    await this.bot.login(this.token)
    this.started = true
  }

  async stop(event: string) {
    if (!this.started) return

    this.bot.destroy()
    this.log.info('Stopped bot with event: '+event)
    this.started = false
  }
}
