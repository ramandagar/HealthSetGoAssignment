import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView, Dimensions, Image, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { addToCart } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';
import { showAddToCartToast } from '../utils/Helper';

const ITEMS_PER_PAGE = 6;
const { width } = Dimensions.get('window');

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.products);
  const cartItemsCount = useSelector(state => state.cart.totalItems) || 0;
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (items.length > 0) {
      setDisplayedItems(items.slice(0, page * ITEMS_PER_PAGE));
    }
  }, [items, page]);
  
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    showAddToCartToast(product);
  };
  
  const loadMoreItems = () => {
    if (loadingMore || displayedItems.length >= items.length) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      setPage(prevPage => prevPage + 1);
      setLoadingMore(false);
    }, 500);
  };
  
  const renderFooter = () => {
    if (!loadingMore) return null;
    return <LoadingSpinner loading={true} style={styles.loadingMore} />;
  };
  
  const renderProductItem = ({ item, index }) => {
    // Safety check for item properties
    const title = item?.title || '';
    const price = item?.price ? parseFloat(item.price).toFixed(2) : '0.00';
    
    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.productCard}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.productPrice}>${price}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Icon name="add-circle" size={24} color="#3498db" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Products</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles.cartIconContainer}>
              <Icon name="cart-outline" size={24} color="#0f172a" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount.toString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  if (loading && items.length === 0) {
    return <LoadingSpinner loading={true} fullscreen text="Loading products..." />;
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {typeof error === 'object' ? 'Failed to load products' : error}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchAllProducts())}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={displayedItems}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
      
      <LoadingSpinner loading={loading && items.length > 0 && !loadingMore} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop:50
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cartButton: {
    padding: 8,
  },
  cartIconContainer: {
    position: 'relative',
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
  productsList: {
    padding: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: (width - 32) / 2,
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9fafb',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginLeft: 4,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    color: '#64748b',
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

export default ProductsScreen; 