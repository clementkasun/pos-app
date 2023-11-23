import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

function Foot() {
  return (
    <Footer
      style={{
        textAlign: "center",
        "background-color": "black",
      }}
    >
      <span style={{ "font-weight": "bolder", color: "white" }}>
        Clementechs ©2023 Created by kasun clement rathnayake
      </span>
    </Footer>
  );
}

export default Foot;
