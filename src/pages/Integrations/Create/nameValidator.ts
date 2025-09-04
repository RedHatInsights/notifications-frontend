import awesomeDebouncePromise from 'awesome-debounce-promise';
import { getEndpoints } from '../../../api/helpers/integrations/endpoints-helper';

export const debouncePromise = (
  asyncFunction,
  debounceTime = 250,
  options = { onlyResolvesLast: false }
) => awesomeDebouncePromise(asyncFunction, debounceTime, options);

export const asyncValidator = async (
  value,
  integrationId = undefined,
  intl
) => {
  if (!value) {
    return undefined;
  }

  let response;
  try {
    response = await getEndpoints({ name: value });
  } catch (error) {
    return undefined;
  }

  if (
    response?.data.find(
      ({ id, name }) => name === value && id !== integrationId
    )
  ) {
    throw intl.formatMessage({
      defaultMessage: 'That name is taken. Try another.',
      id: 'wizard.integrations.nameTaken',
    });
  }

  return undefined;
};

let firstValidation = true;
export const setFirstValidated = (bool) => (firstValidation = bool);
export const getFirstValidated = () => firstValidation;

export const asyncValidatorDebounced = debouncePromise(asyncValidator);

export const asyncValidatorDebouncedWrapper = (intl) => {
  if (getFirstValidated()) {
    setFirstValidated(false);
    return (value, id) => (value ? asyncValidator(value, id, intl) : undefined);
  }

  return asyncValidatorDebounced;
};
