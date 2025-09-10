import axios from 'axios'

export class Notifier {
  private readonly bot?: string
  private readonly chat?: string
  constructor(botToken?: string, chatId?: string) { this.bot = botToken; this.chat = chatId }
  async telegram(text: string) {
    if (!this.bot || !this.chat) return
    const url = `https://api.telegram.org/bot${this.bot}/sendMessage`
    await axios.post(url, { chat_id: this.chat, text, parse_mode: 'HTML', disable_web_page_preview: true })
  }
}


