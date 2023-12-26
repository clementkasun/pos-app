// StoreItem.js
import React from 'react';
import { Card, Image } from 'antd';

const { Meta } = Card;

export default function StoreItem({
  addToCart,
  title,
  description,
  price,
  image,
}) {
  const item = {
    title,
    description,
    price,
    count: 1,
    image
  };

  const handleAddToCart = async () => {
    addToCart(item);
  };

  return (
    <Card
      style={{ width: 100, marginBottom: 20 }}
      bodyStyle={{ padding: 10 }}
      hoverable
      onClick={handleAddToCart}
    >
      <Image
        src={image}
        style={{
          width: '100%',
          height: '100%', // Make the image fill the entire height
          objectFit: 'cover',
        }}
      />
      <span style={{ fontWeight: 'bold'}}>{title}</span>
    </Card>
  );
}
