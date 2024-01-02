import React, { useEffect, useState } from "react";
import StoreItem from "./StoreItem";
import { Row, Col, Divider, Spin } from "antd";

export default function ProductPage({ cart, setCart }) {
  const [items, setItems] = useState([]);
  const [prodCategories, setProdCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://posbackendservice.clementechs.online/product/getProducts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (Array.isArray(data.products)) {
          setItems(data.products);
        } else {
          console.error("Invalid data format:", data.products);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    productCategories();
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.title === item.title);

    if (existingItem) {
      existingItem.count += item.count;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...item, count: item.count }]);
    }
  };

  const productCategories = async () => {
    try {
      const response = await fetch("https://posbackendservice.clementechs.online/productCategory/getAll");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProdCategories(data.productCategories);
    } catch (error) {
      console.error("Error fetching product categories:", error.message);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  const groupedItems = items.reduce((groups, item) => {
    const prodCatRecord = prodCategories.find((cat) => cat.id === item.categoryId);
    const groupKey = prodCatRecord ? prodCatRecord.name : "";
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
          <Divider orientation="left" style={{ fontWeight: "bold", color: "white" }}>
            {category}
          </Divider>
          <Row gutter={[1, 1]}>
            {categoryItems.map((item) => (
              <Col span={Math.round(24 / 6)} key={item.id}>
                <StoreItem
                  addToCart={addToCart}
                  title={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
}
