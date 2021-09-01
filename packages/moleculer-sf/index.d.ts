import { Service, ServiceSchema } from 'moleculer'

declare namespace MoleculerSF {
  type MoleculerSFPluginSchema = ServiceSchema & {
    $pluginOrder: number,
  }

  type MoleculerSFPluginFunction = (serviceSchema: ServiceSchema) => Partial<MoleculerSFPluginSchema> | void

  type PluginType = string | MoleculerSFPluginFunction
  const moleculerServiceFactory: (globalPlugins: PluginType[]) => typeof Service

  interface MoleculerSFSchema {
    global?: boolean,
    plugins?: PluginType[]
  }
}

declare module 'moleculer' {
  interface ServiceSchema {
    $factory?: MoleculerSF.MoleculerSFSchema | boolean
  }
}

export = MoleculerSF
