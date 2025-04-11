import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Button from './Button';

const ProductCard = ({ 
  product, 
  onPress, 
  onAddToCart,
  compact = false
}) => {
  if (!product) return null;
  const { title, price, image, category } = product;
  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: image }} 
          style={styles.compactImage} 
          resizeMode="contain"
        />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.compactPrice}>${price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButtonCompact}
          onPress={() => onAddToCart(product)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Button 
          title="Add to Cart" 
          onPress={() => onAddToCart(product)} 
          style={styles.addButton}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 150,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#334155',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 0,
    alignSelf: 'flex-start',
  },
  compactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: '48%',
    marginBottom: 12,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  compactContent: {
    padding: 10,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    height: 40,
    color: '#334155',
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  addButtonCompact: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#3498db',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});

export default ProductCard; 