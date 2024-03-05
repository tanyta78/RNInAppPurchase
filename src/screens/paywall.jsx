import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  finishTransaction, //For acknowledging a purchase
  getProducts, //For fetching available products
  purchaseErrorListener, //For listening to purchase errors
  purchaseUpdatedListener, //For listening to purchase events
  requestPurchase, //For initiating in-app purchases
} from 'react-native-iap';
import ProductItem from '../components/productItem';
import { constants } from '../utils/constants';

const backgroundImage = require('../assets/recipe.jpg');

const Paywall = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction({ purchase, isConsumable: false });
          } catch (error) {
            console.error(
              'An error occurred while completing transaction',
              error,
            );
          }
          notifySuccessfulPurchase();
        }
      },
    );
    const purchaseErrorSubscription = purchaseErrorListener(error =>
      console.error('Purchase error', error.message),
    );
    const fetchProducts = async () => {
      try {
        const result = await getProducts({ skus: constants.productSkus });
        setProducts(result);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error fetching products');
      }
    };
    fetchProducts();
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, [notifySuccessfulPurchase]);

  const notifySuccessfulPurchase = useCallback(() => {
    Alert.alert('Success', 'Purchase successful', [
      {
        text: 'Home',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  }, [navigation]);

  const handlePurchase = async productId => {
    setLoading(true);
    try {
      await requestPurchase({ skus: [productId] });
    } catch (error) {
      Alert.alert('Error occurred while making purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <View style={styles.header}>
            <Image source={backgroundImage} style={styles.image} />
            <View style={styles.heading}>
              <Text style={styles.text}>Unlock all Recipes</Text>
              <Text style={styles.subText}>
                Get unlimited access to 1000+ recipes
              </Text>
            </View>
          </View>
          {products.map((product, index) => (
            <ProductItem
              key={index}
              title={product.title}
              onPress={() => handlePurchase(product.productId)}
            />
          ))}
        </>
      ) : (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    width: '100%',
  },
  image: {
    resizeMode: 'cover',
    opacity: 0.5,
    height: 200,
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heading: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 18,
    color: '#333',
    overflow: 'hidden',
  },
  indicator: {
    justifyContent: 'center',
    flex: 1,
  },
});

export default Paywall;
