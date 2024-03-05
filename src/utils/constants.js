import { Platform } from 'react-native';

const productSkus = Platform.select({
  android: ['recipe_app_premium'], //product id from google play console
});
export const constants = {
  productSkus,
};
