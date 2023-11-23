import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Currency from "./Currency";
import POS from "./Pos";
import ProductCategory from "./ProductCategory";
import Product from './Product';
import Dashboard from "./Dashboard";
import Receipt from "./Reciept";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/product-category" element={<ProductCategory />} />
        <Route path="/products" element={<Product />} />
        <Route path="/reciept" element={<Receipt />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
