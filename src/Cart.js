import React from "react";
import { Card, Badge, Modal } from "antd";
import "./RecieptModal.css"; // Import your CSS file for styling the modal and the "print" button

function Cart({ cart }) {
  const handlePrint = () => {
    // Print the content of the modal
    const printContents = document.querySelector(".receipt-modal").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  };

  const handleViewReceipt = () => {
    const receiptItems = cart.map((item) => ({
      quantity: item.count,
      name: item.title,
      price: item.price * item.count,
    }));

    const subtotal = receiptItems.reduce((acc, item) => acc + item.price, 0);
    const tax = subtotal * 0.08; // Assuming 8% tax
    const total = subtotal + tax;

    const receiptText = (
      <div>
        <ul>
          {receiptItems.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.name}: ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="summary">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (8%): ${tax.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
        <button className="print-button" onClick={handlePrint}>
          Print Receipt
        </button>
      </div>
    );

    // Open a modal with the receipt information
    Modal.info({
      title: "Receipt",
      className: "receipt-modal", // Apply custom styles to the modal
      content: (
        <div>
          <p>{receiptText}</p>
        </div>
      ),
      onOk() {},
    });
  };

  // Calculate the total amount
  const total = cart.reduce((acc, item) => acc + item.price * item.count, 0);

  return (
    <Card style={{ height: "1000px", borderRadius: 0 }}>
      <div style={{ width: '100%', height: '700px'}}>
        {cart.map((item, index) => (
          <Badge.Ribbon
            text={item.count}
            color="magenta"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                alt={item.title}
                src={item.image}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              <p style={{ fontWeight: "bold", textAlign: "left" }}>
                {item.title}
              </p>
            </div>
            <span>Rs. {item.price}</span>
          </Badge.Ribbon>
        ))}
      </div>

      {/* Display the total amount */}
      <div style={{ padding: 16, borderTop: "1px solid #ccc", height: "300px" }}>
        <p><b>Total:</b> ${total.toFixed(2)}</p>
      </div>

      {/* Checkout button */}
      <button onClick={handleViewReceipt}>View Receipt</button>
    </Card>
  );
}

export default Cart;
