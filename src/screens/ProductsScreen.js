import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView, Dimensions, Image, Platform, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { addToCart, decreaseQuantity } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/Ionicons';
import { showAddToCartToast } from '../utils/Helper';

const ITEMS_PER_PAGE = 6;
const { width } = Dimensions.get('window');

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.products);
  const cart = useSelector(state => state.cart.items);
  const cartItemsCount = useSelector(state => state.cart.totalItems) || 0;
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (items.length > 0) {
      const filtered = searchQuery.trim() 
        ? items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : items;
      
      setFilteredItems(filtered);
      setDisplayedItems(filtered.slice(0, page * ITEMS_PER_PAGE));
    }
  }, [items, page, searchQuery]);
  
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    showAddToCartToast(product);
  };
  
  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product.id));
  };
  
  const getItemQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  const loadMoreItems = () => {
    if (loadingMore || displayedItems.length >= filteredItems.length) return;
    
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
    const quantity = getItemQuantity(item.id);
    
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
            
            {quantity > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDecreaseQuantity(item);
                  }}
                >
                  <Icon name="remove-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <Icon name="add-circle" size={24} color="#3498db" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                <Icon name="add-circle" size={24} color="#3498db" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
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
        
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="close-circle" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
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
          <Text style={styles.emptyText}>
            {searchQuery.length > 0 
              ? `No products found matching "${searchQuery}"` 
              : 'No products found'}
          </Text>
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
    marginTop: 50
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0f172a',
  },
  clearButton: {
    padding: 4,
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
    fontWeight: '500',
    color: '#3498db',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginTop: 24,
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
  loadingMore: {
    marginVertical: 16,
  },
});

export default ProductsScreen; 