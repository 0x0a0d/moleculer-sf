import * as Moleculer from 'moleculer'

export type MoleculerPluginSchema = Moleculer.ServiceSchema & {
  $pluginOrder: number,
}

export type moleculerPluginFunction<T = Moleculer.ServiceSchema> = (schema: T, moleculer?: any) => MoleculerPluginSchema | void | null

declare class MoleculerSfService extends Moleculer.Service {
  constructor(broker: Moleculer.ServiceBroker, schema: Moleculer.ServiceSchema)
}

type PluginType = string | moleculerPluginFunction

declare const moleculerServiceFactory: (moleculer: any, plugins: PluginType | PluginType[]) => typeof Moleculer.Service

export type FactorySchema = boolean | {
  global?: boolean,
  plugins?: string | string[]
}

interface ServiceSchema {
  $factory?: FactorySchema
}

export default moleculerServiceFactory
