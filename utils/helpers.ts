import { useApi } from '~/composable/api';
import { HttpStatus } from '~/types/api';
import type { IAnyObject } from '~/types/helpers';

export const generateUniqueKey = () => {
  return `${Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}${new Date().getTime()}`;
};

export const isNoEmpty = (value: any): boolean => {
  return (
    typeof value !== 'undefined' &&
    value !== null &&
    typeof value !== 'number' &&
    value !== ''
  );
};

export const typeOfObject = (value: any): boolean => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

export const hasField = (object: any, key: string | number): boolean => {
  return typeOfObject(object) && typeof object[key] !== 'undefined';
};

export const getFields = (
  object: any,
  ...args: Array<string | number>
): any => {
  if (typeOfObject(object)) {
    for (let i = 0; i < args.length; i++) {
      const key = args[i];
      if (typeof object[key] !== 'undefined') {
        if (typeof args[i + 1] !== 'undefined') {
          object = object[key];
        } else {
          return object[key];
        }
      }
    }
    console.log('----');
  }
  return null;
};

export const getFieldIfNoEmpty = <T = any>(
  object: any,
  key: string,
  default_value: unknown = null,
): T => {
  return typeOfObject(object) &&
    typeof object[key] !== 'undefined' &&
    isNoEmpty(object[key])
    ? object[key]
    : default_value;
};
export const getField = <T = IAnyObject, V = any>(
  object: T,
  key: string | number,
  default_value: any = null,
): V => {
  return typeOfObject(object) && typeof object[key] !== 'undefined'
    ? object[key]
    : default_value;
};

export function getValueByKeys<T = any>(
  data: any,
  path: string,
  defaultValue: T | null = null,
): T | null {
  if (typeof data !== 'object' || data === null) {
    return defaultValue;
  }

  const keys = path.split('.');
  let result: any = data;

  for (const key of keys) {
    if (Array.isArray(result) && !isNaN(Number(key))) {
      result = result[Number(key)];
    } else if (typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}
export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = String(date.getFullYear()).slice(-2); // Последние две цифры года
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}:${month}:${year} ${hours}:${minutes}`;
}
export const generateIconClass = (
  icon: string,
  type: 'rr' | 'sr' = 'rr',
): string => {
  return `app-icon fi fi-${type}-${icon}`;
};

export const getPriceBtc = async (btcAmount: number): Promise<number> => {
  try {
    // Validate input
    if (typeof btcAmount !== 'number' || isNaN(btcAmount) || btcAmount < 0) {
      throw new Error('Invalid Bitcoin amount provided');
    }

    let btcPriceInUsd: number;

    try {
      // Fetch Bitcoin price in USD from Binance API
      const response = await $fetch(
        'https://api.binance.com/api/v3/ticker/price',
        {
          method: 'GET',
          params: {
            symbol: 'BTCUSDT',
          },
        },
      );

      // Extract Bitcoin price in USDT (stablecoin pegged to USD)
      btcPriceInUsd = parseFloat(response?.price);

      // Validate price data
      if (!btcPriceInUsd || isNaN(btcPriceInUsd)) {
        throw new Error('Invalid or missing price data from API');
      }
    } catch (apiError) {
      console.warn(
        'Binance API failed, using fallback price of $100,000:',
        apiError,
      );
      btcPriceInUsd = 100000; // Fallback price
    }

    // Calculate total value in USD
    const totalValue: number = btcAmount * btcPriceInUsd;

    // Ensure totalValue is a valid number
    if (isNaN(totalValue)) {
      throw new Error('Calculation error: Resulting value is not a number');
    }

    return Number(totalValue.toFixed(2)); // Round to 2 decimal places
  } catch (error) {
    console.error('Error processing Bitcoin price:', error);
    throw new Error('Failed to process Bitcoin price');
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { fetchDataClient } = useApi();

  const res = await fetchDataClient('/images/upload', formData, 'POST');

  return res.data.url;
};

export async function uploadFiles(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  const { fetchDataClient } = useApi();

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file); // Ключ должен быть 'file' как в FileInterceptor

    try {
      const response = await fetchDataClient(
        'https://dev-api.shod-art.uz/file',
        formData,
        'POST',
      );

      if (!response.statusCode === HttpStatus.OK)
        throw new Error('Upload failed');

      urls.push(response.data.url);
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  }

  return urls;
}
