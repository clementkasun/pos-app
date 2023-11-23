// StoreItem.js
import React, { useState } from 'react';
import { Button, Card, Image } from 'antd';

const { Meta } = Card;

export default function StoreItem({
  addToCart,
  title,
  description,
  image,
  price,
}) {
  const item = {
    title,
    description,
    image,
    price,
    count: 1, // You can set the initial count as needed
  };

  const handleAddToCart = () => {
    addToCart(item);
  };
  
  return (
    <Card
      hoverable
      style={{ width: 100, height: 100, margin: '16px' }}
      cover={<Image alt={title} src={require(`./storeItems/${image}`)} style={{ width: 100, height: 70 }} />}
      onClick={handleAddToCart}
    >
      <Meta title={title} style={{ width: 100, height: 20, margin: 0, padding: 0 }} />
    </Card>
  );
}
