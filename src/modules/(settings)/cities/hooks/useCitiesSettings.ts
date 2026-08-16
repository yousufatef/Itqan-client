import { SETTINGS_CITIES_QUERY_KEY } from '../constants/cities.constants';

export const useCitiesSettings = () => {
  return {
    queryKey: SETTINGS_CITIES_QUERY_KEY,
  };
};
