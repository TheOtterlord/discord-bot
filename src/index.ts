import Discord from 'discord.js'
import Logger from './logger'
import { commands } from './commands'

import { config } from 'dotenv'

config()

export class Bot {
  client!: Discord.Client
  log!: Logger

  constructor() {
    this.client = new Discord.Client()
    this.log = new Logger('bot', './logs', 0)
  }

  start() {
    this.client.once('ready', () => {
      if (!this.client.user) return

      this.client.user.setActivity('https://duxcore.co', {
        type: 'WATCHING'
      })
      this.log.info('Duxcore bot is online')
    })

    this.client.on('message', message => {
      if (!message.content.startsWith(process.env.PREFIX!)) return
      this.exec(message)
    })

    this.client.login(process.env.TOKEN!)
  }

  exec(message: Discord.Message) {
    const req = message.content.split(process.env.PREFIX!)[1].split(' ')
    const cmd = req[0].toLowerCase()
    const args = req.splice(1)

    if (!commands[cmd]) return

    try {
      commands[cmd](message, ...args)
    } catch (err) {
      this.log.error(`[Error] ${err.message}`)
    }
  }

  async stop(event: string) {
    this.log.info('Duxcore bot stopped')
    await this.log.close()
  }
}

const bot = new Bot()
bot.start()

const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"]

events.forEach(event => {
  process.on(event, () => bot.stop(event))
})
