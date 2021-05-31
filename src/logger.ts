import fs from 'fs'
import path from 'path'

const colors = {
  info: "\x1b[32m",
  debug: "\x1b[35m",
  trace: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  fatal: "\x1b[1m\x1b[31m",
  reset: "\x1b[0m"
}

export default class Logger {
  name!: string
  path!: string
  logLevel!: number
  bufferSize!: number
  cache: string[] = []
  writing = false

  constructor(name: string, folderPath: string, logLevel: number, bufferSize = 100) {
    if (bufferSize < 1) throw Error(`Buffer size must be greater than 1; received ${bufferSize}`)
    if (logLevel < 0 || logLevel > 2) throw Error(`Log level must be 0, 1, or 2; received ${logLevel}`)

    this.name = name
    this.path = folderPath
    this.logLevel = logLevel
    this.bufferSize = bufferSize

    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path, { recursive: true })
    fs.writeFileSync(path.join(this.path, `${this.name}.log`), '')
  }

  log(message: string, level: string) {
    const time = this.time()

    console.log(`[${time} - ${colors[level]}${level}${colors.reset}] ${message}`)
    this.cache.push(`[${time} - ${level}] ${message}`)
    this.writeCache()
  }

  async writeCache(force=false) {
    if (this.writing || 
      this.cache.length === 0 ||
      (!force && this.cache.length <= this.bufferSize)
    ) return;

    const text = this.cache.join("\n") + "\n";
    
    this.cache = [];
    this.writing = true;

    fs.appendFileSync(path.join(this.path, `${this.name}.log`), text)

    this.writing = false;

    if (this.cache.length > 0) await this.writeCache();
  }

  time() {
    const date = new Date()
    const hours =  String(date.getHours()).padStart(2, "0")
    const minutes =  String(date.getMinutes()).padStart(2, "0")
    const seconds =  String(date.getSeconds()).padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`
  }

  info(message: string) {
    this.log(message, 'info')
  }

  debug(message: string) {
    if (this.logLevel < 1) return
    this.log(message, 'debug')
  }

  trace(message: string) {
    if (this.logLevel < 2) return
    this.log(message, 'trace')
  }

  warn(message: string) {
    this.log(message, 'warn')
  }

  error(message: string) {
    this.log(message, 'error')
  }

  fatal(message: string) {
    this.log(message, 'fatal')
  }

  /**
   * Writes the remaining cache to the log file
   */
  async close() {
    if(this.cache.length === 0 || this.writing) return
    this.writeCache(true)
  }
}
