import type {
  App as ServerApp,
  Organization as ServerOrganization,
  Deployment as ServerDeployment,
} from '~~/server/db/schema';

type ReplaceDates<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<ReplaceDates<U>>
  : T extends object
  ? { [K in keyof T]: ReplaceDates<T[K]> }
  : T;

export type App = ReplaceDates<ServerApp>;
export type Organization = ReplaceDates<ServerOrganization>;
export type Deployment = ReplaceDates<ServerDeployment>;
