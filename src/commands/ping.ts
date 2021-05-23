import { Message } from "discord.js";

export default function ping(message: Message, ...args: string[]) {
  message.reply('Pong!')
}
