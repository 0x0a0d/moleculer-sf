import 'moleculer'
import { MoleculerSFPluginFunction } from 'moleculer-sf'

/**
 * @param {boolean} [pluralizeName=false]
 */
declare function moleculerSfMixinDb(pluralizeName: boolean): MoleculerSFPluginFunction;
export default moleculerSfMixinDb


declare module 'moleculer' {
  interface ServiceSettingSchema {
    mongoURI?: string
  }
}
