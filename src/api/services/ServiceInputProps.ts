import type { GerarServiceProps } from "./gerarService";

export type ServiceInputProps<
  BODY, 
  QUERY 
> = (BODY extends null 
      ? (QUERY extends null ? {} : Omit<GerarServiceProps<BODY, QUERY>['options'], 'body' | 'headers' | 'contentType'>)
      : (QUERY extends null ? Omit<GerarServiceProps<BODY, QUERY>['options'], 'query' | 'headers' | 'contentType'> : Omit<GerarServiceProps<BODY, QUERY>['options'], 'headers' | 'contentType'>))