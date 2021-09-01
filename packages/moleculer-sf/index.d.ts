import { Service, ServiceSchema } from 'moleculer'

declare namespace MoleculerSF {
  type MoleculerSFPluginSchema = ServiceSchema & {
    $pluginOrder: number,
  }

  type MoleculerSFPluginFunction = (schema: ServiceSchema) => Partial<MoleculerSFPluginSchema> | void
  type MoleculerSFCustomPluginFunction = (schema: ServiceSchema, options?: CustomPluginOptions) => Partial<MoleculerSFPluginSchema> | void

  interface CustomPluginOptions {}
  interface MoleculerSFCustomPlugins {
    [name: string]: MoleculerSFCustomPluginFunction
  }

  type PluginType = string | MoleculerSFPluginFunction
  type CustomPluginType = string | MoleculerSFCustomPluginFunction | {
    name: keyof MoleculerSFCustomPlugins,
    options?: CustomPluginOptions
  }

  const moleculerServiceFactory: (globalPlugins: PluginType[], customPlugins?: MoleculerSFCustomPlugins) => typeof Service

  interface MoleculerSFSchema {
    global?: boolean,
    mixins?: CustomPluginType[]
  }
}

declare module 'moleculer' {
  interface ServiceSchema {
    $factory?: MoleculerSF.MoleculerSFSchema | boolean
  }
}

export = MoleculerSF
