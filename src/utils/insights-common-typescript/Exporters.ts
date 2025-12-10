export enum ExporterType {
  JSON = 'json',
  CSV = 'csv',
}

export const exporterTypeFromString = (value: string): ExporterType => {
  const lowerCaseValue = value.toLowerCase();
  if (lowerCaseValue === ExporterType.CSV) {
    return ExporterType.CSV;
  } else if (lowerCaseValue === ExporterType.JSON) {
    return ExporterType.JSON;
  }

  throw new Error(`Invalid ExporterType requested [${value}]`);
};

export interface Exporter<T> {
  readonly type: ExporterType;
  export(elements: Array<T>): Blob;
}

export type Headers<T> = Array<
  [keyof ReturnType<ExporterCsv<T>['serialize']>, string]
>;
export type ExporterHeaders<Exporter extends ExporterCsv<T>, T> = Array<
  [keyof ReturnType<Exporter['serialize']>, string]
>;

export interface HasToString {
  toString: () => string;
}

type SerializedObject = {
  [key: string]: HasToString | undefined;
};

export abstract class ExporterCsv<T> implements Exporter<T> {
  readonly type = ExporterType.CSV;

  private encode(value: string): string {
    let result = value.replace(/"/g, '""');
    if (result.includes(',') || result.includes('"')) {
      result = '"' + result + '"';
    }

    return result;
  }

  public export(elements: Array<T>) {
    const headers = this.headers();
    const headerString = headers.map((h) => this.encode(h[1])).join(',') + '\r';
    const dataArray = elements.map(this.serialize).map((e) => {
      return (
        Object.values(headers)
          .map((k) => {
            let rawValue = e[k[0]];
            if (!rawValue) {
              rawValue = '';
            }

            return this.encode(rawValue.toString());
          })
          .join(',') + '\r'
      );
    });

    return new Blob([headerString].concat(dataArray), {
      type: 'text/csv',
    });
  }

  public abstract headers(): Headers<T>;
  public abstract serialize(element: T): SerializedObject;
}

export abstract class ExporterJson<T> implements Exporter<T> {
  readonly type = ExporterType.JSON;

  public export(elements: Array<T>) {
    return new Blob([JSON.stringify(elements)], {
      type: 'application/json',
    });
  }
}
