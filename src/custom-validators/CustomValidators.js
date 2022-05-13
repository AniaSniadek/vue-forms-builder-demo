/**
 * Example class with custom validators
 */
export class CustomValidators {
  /**
   * Method that returns error if the given value has white spaces
   * Method type is ValidationError or null
   */
  static noWhiteSpace = (value) => {
    return !((value || '').trim().length === 0) ? null : { noWhiteSpace: true };
  };

  /**
   * Method that returns error if the given value is not in the specified array
   * Method type is ValidatorFunction
   */
  static arrayIncludes = (arrayOfValues) => {
    const arrayIncludes = (value) => {
      return arrayOfValues.includes(value) ? null : { arrayIncludes: true };
    };

    return arrayIncludes;
  };
}
