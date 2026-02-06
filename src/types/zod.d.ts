export {};

/** Zod nativeEnum 타입 개선 */
declare module 'zod' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T]> {
    _input: T[keyof T];
    _output: T[keyof T];
  }
}
