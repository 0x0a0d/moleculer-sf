import { ServiceBroker, ServiceSchema, Service as MoleculerService } from 'moleculer'
import * as Moleculer from 'moleculer'

// @ts-ignore
export type MoleculerSfPlugin = (schema: ServiceSchema, moleculer: Moleculer) => ServiceSchema & {
  $pluginOrder: number,
}

declare class MoleculerSfService extends MoleculerService {
  constructor(broker: ServiceBroker, schema: ServiceSchema)
}

// @ts-ignore
export const moleculerServiceFactory: (moleculer: Moleculer, plugins: string | string[]) => MoleculerSfService
