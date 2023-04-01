import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

export const axios = setupCache(Axios)
