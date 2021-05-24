interface HasId<ID> {
    id: ID
}

export const findByKey = <T, KEY extends keyof T>(val: T[KEY], key: KEY) => (value: T) => value[key] === val;
export const findById = <T extends HasId<T['id']>>(id: T['id']) => findByKey<T, 'id'>(id, 'id');
