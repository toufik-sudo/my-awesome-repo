/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from "./ApiRequestOptions";

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;
// let headers = new Headers();
// headers.set('content-type', 'application/json; charset=utf-8');
// headers.set('Accept', 'application/json');
// headers.set('Origin', window.location.hostname);
// headers.set('Host', 'api.huuray.com');

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: "include" | "omit" | "same-origin";
  TOKEN?: string | Resolver<string> | undefined;
  USERNAME?: string | Resolver<string> | undefined;
  PASSWORD?: string | Resolver<string> | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};

export const OpenAPI: OpenAPIConfig = {
  BASE: "",
  VERSION: "4",
  WITH_CREDENTIALS: true,
  CREDENTIALS: "include",
  TOKEN: "errger-dc71-4723-85ae-eetatbeat",
  USERNAME: "test@gmail.com",
  PASSWORD: "qdsfv!56416541",
  HEADERS: {
    Referer: window.location.host,
    Origin: window.location.host + "/",
    Host: "api.huuray.com",
    "Content-Type": "application/json; charset=utf-8",
    "Sec-Fetch-Mode": "no-cors",
  },
  ENCODE_PATH: undefined,
};
