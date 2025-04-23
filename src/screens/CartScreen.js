import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import CartItem from '../components/CartItem';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector(state => state.cart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleCheckout = () => {
    setCheckoutLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setCheckoutLoading(false);
      
      Alert.alert(
        'Order Placed Successfully!',
        'Thank you for your purchase. Your order has been placed successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              dispatch(clearCart());
              navigation.navigate('Products');
            }
          }
        ]
      );
    }, 1500);
  };
  
  const renderPromoCode = () => (
    <View style={styles.promoContainer}>
      <View style={styles.promoHeader}>
        <Icon name="pricetag-outline" size={18} color="#64748b" />
        <Text style={styles.promoTitle}>Apply Promo Code</Text>
      </View>
      <TouchableOpacity 
        style={styles.promoButton}
        onPress={() => Alert.alert('Promo Code', 'This feature is coming soon!')}
      >
        <Text style={styles.promoButtonText}>Add Code</Text>
        <Icon name="chevron-forward" size={16} color="#3498db" />
      </TouchableOpacity>
    </View>
  );
  
  const renderPaymentOptions = () => (
    <View style={styles.paymentContainer}>
      <Text style={styles.paymentTitle}>Payment Methods</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity style={[styles.paymentOption, styles.activePaymentOption]}>
          <Icon name="card-outline" size={20} color="#3498db" />
          <Text style={styles.activePaymentText}>Credit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon name="cash-outline" size={20} color="#64748b" />
          <Text style={styles.paymentText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon name="wallet-outline" size={20} color="#64748b" />
          <Text style={styles.paymentText}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
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
            onPress={() => 
              Alert.alert(
                'Clear Cart',
                'Are you sure you want to remove all items from your cart?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', onPress: () => dispatch(clearCart()), style: 'destructive' }
                ]
              )
            }
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
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
              scrollEnabled={false}
            />
            
            {renderPromoCode()}
            {renderPaymentOptions()}
            
            <View style={styles.deliveryContainer}>
              <Text style={styles.deliveryTitle}>Delivery Information</Text>
              <View style={styles.deliveryInfo}>
                <Icon name="location-outline" size={20} color="#64748b" />
                <View style={styles.deliveryAddress}>
                  <Text style={styles.deliveryAddressText}>123 Main Street, Apt 4B</Text>
                  <Text style={styles.deliveryCityText}>New York, NY 10001</Text>
                </View>
                <TouchableOpacity style={styles.changeButton}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.spacer} />
          </ScrollView>
          
          <View style={styles.footer}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>${(totalAmount * 0.08).toFixed(2)}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${(totalAmount + (totalAmount * 0.08)).toFixed(2)}</Text>
              </View>
            </View>
            
            <Button
              title={`Checkout (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
              onPress={handleCheckout}
              style={styles.checkoutButton}
              loading={checkoutLoading}
            />
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
    marginTop: 50
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
  scrollContainer: {
    flex: 1,
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
  promoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  promoButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  paymentContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  activePaymentOption: {
    backgroundColor: '#e6f0fa',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  paymentText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  activePaymentText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
    marginLeft: 4,
  },
  deliveryContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddress: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryAddressText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  deliveryCityText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  changeButton: {
    padding: 6,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
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