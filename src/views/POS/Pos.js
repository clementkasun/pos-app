

import React, { useState } from "react";
import ProductPage from "./component/ProductPage.js";
import Cart from "./component/Cart.js";
import { Layout, Row, Col } from "antd";

const { Content } = Layout;

const Pos = () => {
  const [cart, setCart] = useState([]);
  return (
    <>
      <div className="content">
        <Row gutter={16}>
          <Col span={18}>
            <ProductPage cart={cart} setCart={setCart} />
          </Col>
          <Col span={6}>
            <Cart cart={cart}/>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Pos;
