import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productsSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';
import { showAddToCartToast } from '../utils/Helper';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(state => state.products);
  const cartItemsCount = useSelector(state => state.cart.totalItems) || 0;
  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
      showAddToCartToast(selectedProduct);
    }
  };
  
  if (loading && !selectedProduct) {
    return <LoadingSpinner loading={true} fullscreen text="Loading product details..." />;
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {typeof error === 'object' ? 'Failed to load product' : error}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchProductById(productId))}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (!selectedProduct) {
    return <LoadingSpinner loading={true} fullscreen text="Loading product details..." />;
  }
  
  const { title, price, description, category, image, rating } = selectedProduct;
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="cart-outline" size={24} color="#0f172a" />
            <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount.toString()}
                </Text>
              </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  name={star <= Math.round(rating?.rate || 0) ? 'star' : 'star-outline'}
                  size={16}
                  color={star <= Math.round(rating?.rate || 0) ? '#f59e0b' : '#cbd5e1'}
                  style={styles.star}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating?.rate.toFixed(1)} ({rating?.count} reviews)
            </Text>
          </View>
          
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addButton}
        />
      </View>
      
      <LoadingSpinner loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop: 50,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#3498db',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    backgroundColor: '#fff',
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  category: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default ProductDetailsScreen; 