export enum EntityType {
  'thing'     = 'thing',
  'container' = 'container',
}

export type Entity = {
  id: string,
  name: string,
  description?: string,
  type: EntityType,
  value: number,
  parent: string,
};

export type PreparedForEntity = Omit<Entity, 'id'>;
