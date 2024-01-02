// StoreItem.js
import React from 'react';
import { Card, Image } from 'antd';

const { Meta } = Card;

export default function StoreItem({
  addToCart,
  id,
  title,
  description,
  price,
  image,
}) {
  const item = {
    id,
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
      style={{ width: 120, height: 150, margin: 8, textAlign: 'center' }}
      bodyStyle={{ padding: 0 }}
      hoverable
      onClick={handleAddToCart}
    >
      <Image
        src={image}
        alt={title}
        width={120}
        height={100}
        margin={0}
        className='rounded'
        style={{ objectFit: 'cover', marginBottom: 2 }}
      />
      <div>
        <span style={{ fontWeight: 'bold', fontSize: 12, 'font-family': 'Nunito, sans-serif'}}>{title}</span>
      </div>
    </Card>
  );
}
