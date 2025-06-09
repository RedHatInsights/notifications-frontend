import { useLocation, useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';

export type UseUrlStateResponse<T> = [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>
];
export type Serializer<T> = (value: T | undefined) => string | undefined;
export type Deserializer<T> = (value: string | undefined) => T | undefined;

export type UseUrlStateType<T> = (
  name: string,
  serializer: Serializer<T>,
  deserializer: Deserializer<T>,
  initialValue?: T
) => UseUrlStateResponse<T>;

export const useUrlState = <T>(
  name: string,
  serializer: Serializer<T>,
  deserializer: Deserializer<T>,
  initialValue?: T
): UseUrlStateResponse<T> => {
  const navigate = useNavigate();
  const location = useLocation();

  const setUrlValue = useCallback(
    (serializedValue: string | undefined) => {
      const search = new URLSearchParams(location.search);
      if (serializedValue === undefined) {
        search.delete(name);
      } else {
        search.set(name, serializedValue);
      }

      const searchString = '?' + search.toString();
      if (searchString !== location.search) {
        navigate({
          ...location,
          search: searchString,
        });
      }
    },
    [location, navigate, name]
  );

  const getUrlValue = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get(name) || undefined;
  }, [location, name]);

  const [value, localSetValue] = useState<T | undefined>(() => {
    const urlValue = getUrlValue();
    if (urlValue === undefined) {
      return initialValue;
    } else {
      return deserializer(urlValue);
    }
  });

  useEffectOnce(() => {
    const urlValue = getUrlValue();
    if (urlValue === undefined) {
      setUrlValue(serializer(initialValue));
    } else {
      const sanitizedUrlValue = serializer(deserializer(urlValue));
      if (sanitizedUrlValue !== urlValue) {
        setUrlValue(sanitizedUrlValue);
      }
    }
  });

  const setValue = useCallback(
    (newValueOrFunction) => {
      let newValue;
      if (typeof newValueOrFunction === 'function') {
        newValue = newValueOrFunction(value);
      } else {
        newValue = newValueOrFunction;
      }

      if (newValue !== value) {
        localSetValue(newValue);
        const serializedNewValue =
          newValue === undefined ? undefined : serializer(newValue);
        setUrlValue(serializedNewValue);
      }
    },
    [serializer, value, setUrlValue]
  );

  useUpdateEffect(() => {
    const serialized = serializer(value);
    const urlValue = getUrlValue();
    if (serialized !== urlValue) {
      localSetValue(deserializer(urlValue));
    }
  }, [location]);

  return [value, setValue];
};

const serializer = (value: string | undefined) =>
  value === '' ? undefined : value;
const deserializer = (value: string | undefined) =>
  value === undefined ? '' : value;

export type UseUrlStateStringType = (
  name: string,
  initialValue?: string
) => UseUrlStateResponse<string>;
export const useUrlStateString = (name: string, initialValue?: string) =>
  useUrlState<string>(name, serializer, deserializer, initialValue);
