import * as Moleculer from 'moleculer'

// @ts-ignore
export type MoleculerSfPlugin = (schema: Moleculer.ServiceSchema, moleculer: Moleculer) => Moleculer.ServiceSchema & {
  $pluginOrder: number,
}

declare class MoleculerSfService extends Moleculer.Service {
  constructor(broker: Moleculer.ServiceBroker, schema: Moleculer.ServiceSchema)
}

// @ts-ignore
const moleculerServiceFactory: (moleculer: Moleculer, plugins: string | string[]) => typeof Moleculer.Service

export type FactorySchema = boolean | {
  global?: boolean,
  plugins?: string | string[]
}

export default moleculerServiceFactory
