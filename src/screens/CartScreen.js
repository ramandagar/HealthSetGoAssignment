import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector(state => state.cart);
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleCheckout = () => {
    // For demo purposes, we'll just clear the cart
    dispatch(clearCart());
    navigation.navigate('Products');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Shopping Cart</Text>
        </View>
        
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => dispatch(clearCart())}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#cbd5e1" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate('Products')}
            style={styles.shopButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.footer}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items:</Text>
                <Text style={styles.summaryValue}>{totalItems}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 32,
  },
  shopButton: {
    paddingHorizontal: 32,
  },
  cartList: {
    padding: 16,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  checkoutButton: {
    width: '100%',
  },
});

export default CartScreen; 