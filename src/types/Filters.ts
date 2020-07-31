type Setter<T> = (val: T) => void;

export type StandardFilterEnum<T> = Record<keyof T, string>;
export type EnumElement<Enum> = Enum[keyof Enum];
export type FilterBase<Enum extends StandardFilterEnum<any>, T> = Record<EnumElement<Enum>, T>;
export type Filters<Enum extends StandardFilterEnum<any>> = FilterBase<Enum, string>;
export type SetFilters<Enum extends StandardFilterEnum<any>> = FilterBase<Enum, Setter<string>>;
export type ClearFilters<Enum> = (columns: Array<EnumElement<Enum>>) => void;
