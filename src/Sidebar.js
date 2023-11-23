import React, { useState } from "react";
import { Menu } from "antd";
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom"; // Import Link if you're using React Router

const { SubMenu } = Menu;

const Sidebar = () => {
  const [selectedKey, setSelectedKey] = useState("1"); // Default selected key

  const getItem = (title, key, icon, children) => {
    return (
      <Menu.Item key={key} icon={icon}>
        {title}
      </Menu.Item>
    );
  };

  const menuData = [
    getItem(
      <Link to="/">Dashboard</Link>, // Use Link component
      "1",
      <PieChartOutlined />
    ),
    getItem(
      <Link to="/pos">POS</Link>, // Use Link component
      "2",
      <DesktopOutlined />
    ),
    {
      title: "Master Data",
      key: "master_data",
      icon: <UserOutlined />,
      children: [
        getItem(<Link to="/product-category"> Product Category </Link>, "3",),
        getItem(<Link to="/products"> Products </Link>, "4"),
        getItem(<Link to="/inventory"> Inventory </Link>, "5"),
      ],
    },
    {
      title: "Team",
      key: "sub2",
      icon: <TeamOutlined />,
      children: [getItem("Team 1", "6"), getItem("Team 2", "8")],
    },
    getItem(
      <Link to="/files">Files</Link>, // Use Link component
      "9",
      <FileOutlined />
    ),
  ];

  const handleMenuSelect = ({ key }) => {
    setSelectedKey(key);
  };

  return (
    <Menu
      mode="vertical"
      theme="dark"
      selectedKeys={[selectedKey]}
      onSelect={handleMenuSelect}
      style={{ width: '250px' }}
    >
      {menuData.map((item, index) => {
        if (item.children) {
          return (
            <SubMenu key={item.key} title={item.title} icon={item.icon}>
              {item.children.map((child, childIndex) =>
                React.cloneElement(child, {
                  key: `${index}-${childIndex}`,
                })
              )}
            </SubMenu>
          );
        } else {
          return React.cloneElement(item, { key: index });
        }
      })}
    </Menu>
  );
};

export default Sidebar;
