import { Collection, CommandInteraction } from "discord.js";
import glob from "glob";
import { App } from "../app";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export class Commands {
  public app: App
  public cache: Collection<string, any> = new Collection()

  constructor(app: App) {
    this.app = app

    this.startListener()
  }

  register(dir: string): Promise<Commands> {
    return new Promise((res, rej) => {
      const ext = __filename.endsWith("ts") ? "ts" : "js";
      glob(`${dir}/**/cmd.*.${ext}`, async (err, files) => {
        const cmds: any[] = []
        files.map((f) => {
          const imported = require(f);
          if (!(imported.default)) return;

          const cmd = imported.default;
          cmds.push(cmd.data.toJSON())
          this.cache.set(cmd.data.name, cmd);
        });
        const rest = new REST({ version: '9' }).setToken(this.app.token);

        // NOTE: global commands may take up to an hour to update
        (async () => {
          try {
            this.app.log.debug('Started refreshing application (/) commands.');
        
            await rest.put(
              Routes.applicationCommands(this.app.bot.user?.id!) as any,
              { body: cmds },
            );
        
            this.app.log.debug('Successfully reloaded application (/) commands.');
          } catch (error) {
            this.app.log.error(error);
          }
        })()
      });
      res(this);
    });
  }

  private startListener() {
    this.app.bot.on('interactionCreate', interaction => {
      if (!interaction.isCommand()) return
      
      if (this.cache.has(interaction.commandName)) {
        this.app.log.trace(`Received /${interaction.commandName}`)
        this.cache.get(interaction.commandName)?.execute(interaction)
      }
    })
  }
}
