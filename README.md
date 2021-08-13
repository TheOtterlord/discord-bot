# TypeScript Discord Bot Template

A simple Discord bot template for TypeScript.
Featuring slash commands and a logger by default.

## Running the bot

1. Add your bot `TOKEN` to `.env` following the example in `.env.example`.
2. Start the bot using `npm run start`
3. (*optional*) When developing the bot, use `npm run dev` to get `nodemon` hot reload

## Commands

You can add commands to the `src/commands` directory by creating a file matching `cmd.*.ts`.
Use the `cmd.ping.ts` file in `src/commands/misc` as an guide.
