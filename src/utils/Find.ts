interface HasId<ID> {
    id: ID
}

export const findById = <ID, T extends HasId<ID>>(id: ID) => (value: T) => value.id === id;
