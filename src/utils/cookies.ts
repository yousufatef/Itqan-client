import Cookies from 'js-cookie';
import { REFRESH_TOKEN, TOKEN, USER_VERIFIED } from '../constants';

export function removeAuthCookies() {
  Cookies.remove(TOKEN);
  Cookies.remove(REFRESH_TOKEN);
  Cookies.remove(USER_VERIFIED);
}
