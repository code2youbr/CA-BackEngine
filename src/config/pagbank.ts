import { globalConfig } from '../config'

export default () => ({
  pagBank: {
    baseUrl: globalConfig.pagBank.baseUrl,
    apiKey: globalConfig.pagBank.apiKey
  }
})