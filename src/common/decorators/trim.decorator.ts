import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function Trim() {
  return Transform(({ value }) => (isString(value) ? value.trim() : value));
}
