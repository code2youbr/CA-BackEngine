import * as process from 'process'
import dotenv from 'dotenv'

dotenv.config()

export const globalConfig = {
  pagBank:{
    apiKey: process.env.PAGBANK_TOKEN,
    baseUrl: process.env.PAGBANK_BASE_URL,
  }
}