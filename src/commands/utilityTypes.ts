export type CamelCase<S extends string> = S extends `${infer P}-${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : S;

export type Camelize<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};
