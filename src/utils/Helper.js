import { Platform, ToastAndroid, Alert } from 'react-native';

export const MyToast = function (msg) {
    try {
      if (hasValue(msg)) {
        Platform.select({
          ios: () => { Alert.alert('' + msg); },
          android: () => { ToastAndroid.show('' + msg, ToastAndroid.SHORT); }
        })();
      }
    } catch (error) {
      console.log(error);
    }
  }


export const hasValue = (data) => {
    return (data !== undefined) && (data !== null) && (data !== "");
  }
 
export const showAddToCartToast = (product) => {
  if (product && product.title) {
    const toastMessage = `${product.title.substring(0, 20)}${product.title.length > 20 ? '...' : ''} added to cart!`;
    MyToast(toastMessage);
  }
};