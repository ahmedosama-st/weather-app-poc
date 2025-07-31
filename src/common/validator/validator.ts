import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class Validator {
  validate<T, V>(cls: ClassConstructor<T>, plain: V) {
    const instance = plainToInstance(cls, plain);

    const errors = validateSync(instance as object, { skipMissingProperties: false });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return instance;
  }
}
