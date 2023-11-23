import React, { useState } from "react";
import ProductPage from "./ProductPage.js";
import Cart from "./Cart.js";
import TemplateLayout from "./Layout.js";
import { Layout, Row, Col } from "antd";

const { Content } = Layout;

const Pos = () => {
  const [cart, setCart] = useState([]);
  return (
    <TemplateLayout>
      <Content>
        <Row gutter={16}>
          <Col span={16}>
            <ProductPage cart={cart} setCart={setCart} />
          </Col>
          <Col span={8}>
            <Cart cart={cart}/>
          </Col>
        </Row>
      </Content>
    </TemplateLayout>
  );
};

export default Pos;
