/**
* Generated code, DO NOT modify directly.
*/
export interface Attributes {
}

export type Date = string;

export interface Endpoint {
  description?: string;
  enabled?: boolean;
  id?: Uuid;
  name?: string;
  properties?: Attributes;
  type?: EndpointType;
}

export enum EndpointType {
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
}

export interface EntityTag {
  value?: string;
  weak?: boolean;
}

export enum Family {
  CLIENT_ERROR = 'CLIENT_ERROR',
  INFORMATIONAL = 'INFORMATIONAL',
  OTHER = 'OTHER',
  REDIRECTION = 'REDIRECTION',
  SERVER_ERROR = 'SERVER_ERROR',
  SUCCESSFUL = 'SUCCESSFUL',
}

export type JsonObject = Array<{
}>;

export interface Link {
  params?: MapStringString;
  rel?: string;
  rels?: ListString;
  title?: string;
  type?: string;
  uri?: Uri;
  uriBuilder?: UriBuilder;
}

export type ListString = Array<string>;

export interface Locale {
  country?: string;
  displayCountry?: string;
  displayLanguage?: string;
  displayName?: string;
  displayScript?: string;
  displayVariant?: string;
  extensionKeys?: SetCharacter;
  iSO3Country?: string;
  iSO3Language?: string;
  language?: string;
  script?: string;
  unicodeLocaleAttributes?: SetString;
  unicodeLocaleKeys?: SetString;
  variant?: string;
}

export interface MapStringNewCookie {
  [key: string]: NewCookie;
}

export interface MapStringString {
  [key: string]: string;
}

export interface MediaType {
  parameters?: MapStringString;
  subtype?: string;
  type?: string;
  wildcardSubtype?: boolean;
  wildcardType?: boolean;
}

export interface MultivaluedMapStringObject {
  [key: string]: {
};
}

export interface MultivaluedMapStringString {
  [key: string]: string;
}

export interface NewCookie {
  comment?: string;
  domain?: string;
  expiry?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  name?: string;
  path?: string;
  secure?: boolean;
  value?: string;
  version?: number;
}

export interface NotificationHistory {
  created?: Date;
  details?: JsonObject;
  endpointId?: Uuid;
  id?: number;
  invocationResult?: boolean;
  invocationTime?: number;
}

export interface Response {
  allowedMethods?: SetString;
  cookies?: MapStringNewCookie;
  date?: Date;
  entity?: {
};
  entityTag?: EntityTag;
  headers?: MultivaluedMapStringObject;
  language?: Locale;
  lastModified?: Date;
  length?: number;
  links?: SetLink;
  location?: Uri;
  mediaType?: MediaType;
  metadata?: MultivaluedMapStringObject;
  status?: number;
  statusInfo?: StatusType;
  stringHeaders?: MultivaluedMapStringString;
}

export type SetCharacter = Array<string>;

export type SetLink = Array<Link>;

export type SetString = Array<string>;

export interface StatusType {
  family?: Family;
  reasonPhrase?: string;
  statusCode?: number;
}

export type Uri = string;

export type Uuid = string;

export interface UriBuilder {
}

