import React from "react";
import "./Receipt.css";
import "./RecieptModal.css"; // Import the new CSS file for the modal styles

const Receipt = ({ items, subtotal, tax, total, date }) => {
  return (
    <div className="receipt">
      <div className="receipt-header">
        <h1>Point of Sale Receipt</h1>
        <p>Date: {date}</p>
      </div>
      <div className="receipt-items">
        {items.map((item, index) => (
          <div key={index} className="receipt-item">
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-name">{item.name}</span>
            <span className="item-price">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="receipt-summary">
        <div className="summary-subtotal">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-tax">
          <span>Tax (8%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
