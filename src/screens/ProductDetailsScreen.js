import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchAllProducts } from '../redux/slices/productsSlice';
import { addToCart, decreaseQuantity } from '../redux/slices/cartSlice';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';
import { showAddToCartToast } from '../utils/Helper';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { selectedProduct, items, loading, error } = useSelector(state => state.products);
  const cart = useSelector(state => state.cart.items);
  const cartItemsCount = useSelector(state => state.cart.totalItems) || 0;
  const [similarProducts, setSimilarProducts] = useState([]);
  
  useEffect(() => {
    dispatch(fetchProductById(productId));
    if (items.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, productId, items.length]);
  
  useEffect(() => {
    if (selectedProduct && items.length > 0) {
      // Find similar products (same category, excluding current product)
      const similar = items
        .filter(item => 
          item.category === selectedProduct.category && 
          item.id !== selectedProduct.id
        )
        .slice(0, 4); // Limit to 4 similar products
      
      setSimilarProducts(similar);
    }
  }, [selectedProduct, items]);
  
  const getItemQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
      showAddToCartToast(selectedProduct);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (selectedProduct) {
      dispatch(decreaseQuantity(selectedProduct.id));
    }
  };

  const handleSimilarProductPress = (product) => {
    navigation.push('ProductDetails', { productId: product.id });
  };
  
  const renderSimilarProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.similarProductItem}
      onPress={() => handleSimilarProductPress(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.similarProductImage}
        resizeMode="contain"
      />
      <Text style={styles.similarProductTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.similarProductPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
  
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
  const quantity = getItemQuantity(selectedProduct.id);
  
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
          
          {similarProducts.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.similarProductsContainer}>
                <Text style={styles.sectionTitle}>Similar Products</Text>
                <FlatList
                  data={similarProducts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSimilarProductItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarProductsList}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {quantity > 0 ? (
          <View style={styles.quantityFooterContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleDecreaseQuantity}
              >
                <Icon name="remove-circle" size={28} color="#e74c3c" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleAddToCart}
              >
                <Icon name="add-circle" size={28} color="#3498db" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.viewCartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.viewCartText}>View Cart</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            style={styles.addButton}
          />
        )}
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
  quantityFooterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginHorizontal: 16,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 16,
  },
  viewCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  similarProductsContainer: {
    marginTop: 8,
  },
  similarProductsList: {
    paddingVertical: 16,
  },
  similarProductItem: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  similarProductImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  similarProductTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
    height: 40,
  },
  similarProductPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
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