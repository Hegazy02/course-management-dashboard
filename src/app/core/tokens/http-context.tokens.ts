import { HttpContextToken } from '@angular/common/http';

export const SHOW_LOADER = new HttpContextToken<boolean>(() => true);

export const SHOW_ERROR = new HttpContextToken<boolean>(() => true);

export const SUCCESS_MESSAGE = new HttpContextToken<string | null>(() => null);

export const ERROR_MESSAGE = new HttpContextToken<string | null>(() => null);