// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* Type 확인에 사용 */
export function checkTypeGuard<T extends true>(): void {}

//  @ 타입 2개가 완전하게 일치하는지 확인하기
//  checkTypeGuard<CompleteEqual<ISample1, ISample2>>();
type CompleteEqual<A, B> =
  | Exclude<Required<A>, Required<B>>
  | Exclude<Required<B>, Required<A>>
  | Exclude<A, B>
  | Exclude<B, A>;

//  @ DTO 확인용
//  checkTypeGuard<ValidateDTO<ISample1, SampleDTO>>();
type ValidateDTO<A, B> = CompleteEqual<Required<A>, B>;

// @ Schema 확인용
// checkTypeGuard<ValidateSchema<ISample1, SampleSchema>>();
type ValidateSchema<A, B> = ValidateSchema1<A, B> | ValidateSchema2<A, B>;
type ValidateSchema1<A, B> = CompleteEqual<Partial<Omit<B, keyof A>>, Omit<B, keyof A>>;
type ValidateSchema2<A, B> = CompleteEqual<A, Omit<B, keyof Omit<B, keyof A>>>;

/*
  @ Schema + DTO 확인
  checkTypeGuard<ValidateSchemaAndDTO<ISample1, SampleSchema, SampleDTO>>();
*/
export type ValidateSchemaAndDTO<A, B, C> = ValidateSchema<A, B> | ValidateDTO<A, C>;
