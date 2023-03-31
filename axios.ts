import Axios from 'npm:axios@1'
import { setupCache } from 'npm:axios-cache-interceptor@1'

export const axios = setupCache(Axios)
