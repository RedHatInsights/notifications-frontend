export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc'
}

export const sortDirectionFromString = (sortDirection: string): SortDirection => {
    const lowerCaseSortDirection = sortDirection.toLowerCase();
    switch (lowerCaseSortDirection) {
        case SortDirection.ASC:
            return SortDirection.ASC;
        case SortDirection.DESC:
            return SortDirection.DESC;
        default:
            throw new Error(`Invalid sort direction ${sortDirection}`);
    }
};
