import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CartItem = ({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}) => {
  const increaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={decreaseQuantity}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          
          <Text style={styles.totalPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => onRemove(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f1f5f9',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    width: 20,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 'auto',
    marginRight: 5,
  },
  removeButton: {
    padding: 12,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: '500',
  },
});

export default CartItem; 