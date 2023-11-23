import React, { useEffect, useState } from "react";
import StoreItem from "./StoreItem";
import { Row, Col, Divider } from "antd";

export default function ProductPage({ cart, setCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch the entire data
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.title === item.title);

    if (existingItem) {
      // If it exists, increment the count of the existing item
      existingItem.count += item.count;
      setCart([...cart]); // Trigger a state update
    } else {
      // If it doesn't exist, add it to the cart
      setCart([...cart, { ...item, count: item.count }]);
    }
  };

  const groupedItems = items.reduce((groups, item) => {
    const groupKey = item.category;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});

  return (
    <>
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <Divider orientation="left" style={{ fontWeight: "bold", color: "white" }}>{category}</Divider>
          <Row gutter={[1, 1]}>
            {categoryItems.map((item) => (
              <Col span={Math.round(24 / 6)} key={item.id}>
                <StoreItem
                  addToCart={addToCart}
                  title={item.name}
                  image={item.image}
                  description={item.description}
                  price={item.price}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
}
