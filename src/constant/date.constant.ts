export const enum DateTimezone {
  KST = 'Asia/Seoul',
  UTC = 'UTC',
}

// # YYYY-MM-DD 날짜 시간 정규 표현식
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// # YYYY-MM-DD HH:mm:ss 날짜 시간 정규 표현식
export const DATETIME_REGEX =
  /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
