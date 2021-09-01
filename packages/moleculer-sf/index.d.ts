import { Service, ServiceSchema } from 'moleculer'

declare namespace MoleculerSF {
  type MoleculerSFPluginSchema = ServiceSchema & {
    $pluginOrder: number,
  }

  type MoleculerSFPluginFunction = (schema: ServiceSchema) => Partial<MoleculerSFPluginSchema> | void | null
  type MoleculerSFMixinFunction = (schema: ServiceSchema, options?: MixinOptions) => void

  interface MixinOptions {}
  interface MoleculerSFMixins {
    [name: string]: MoleculerSFMixinFunction
  }

  type PluginType = string | MoleculerSFPluginFunction
  type MixinType = string | {
    name: keyof MoleculerSFMixins,
    options: MixinOptions
  }

  const moleculerServiceFactory: (plugins: PluginType[], mixins?: MoleculerSFMixins[]) => typeof Service

  interface MoleculerSFSchema {
    global?: boolean,
    plugins?: PluginType | PluginType[],
    mixins?: MixinType[]
  }
}

declare module 'moleculer' {
  interface ServiceSchema {
    $factory?: MoleculerSF.MoleculerSFSchema | boolean
  }
}

export = MoleculerSF
