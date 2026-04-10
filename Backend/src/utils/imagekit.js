import Imagekit from 'imagekit'
import { config } from '../config/config.js'

export const imagekit = new Imagekit({
    urlEndpoint:config.URL_END_POINT,
    publicKey:config.IAMGE_KIT_PUBLIC_KEY,
    privateKey:config.IAMGE_KIT_PRIVATE_KEY
})
