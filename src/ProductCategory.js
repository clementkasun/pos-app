import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import TemplateLayout from "./Layout.js";
import { Layout, Row, Col, Button, Input, Table, notification } from "antd";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const { Content } = Layout;

Modal.setAppElement('#root');

const ProductCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProdCategories, setProdCategories] = useState([]);

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    const apiUrl = "https://posbackendservice.clementechs.online/productCategory/getAll";

    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    };

    fetch(apiUrl, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Set the fetched categories in the state
        setProdCategories(data.productCategories);
      })
      .catch(error => {
        console.error("Error fetching product categories:", error.message);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createCategory = () => {
    if (categoryName) {
      saveCategory(categoryName);
      setCategoryName('');
      closeModal();
    }
  };

  const saveCategory = () => {
    const apiUrl = "https://posbackendservice.clementechs.online/productCategory/create";

    const categoryData = {
      name: categoryName
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    };

    fetch(apiUrl, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Handle the response data
        console.log("Product category saved:", data);

        // Show save notification
        notification.success({
          message: "Product category saved",
        });

        // Fetch categories again after saving to update the list
        fetchCategories();
      })
      .catch(error => {
        console.error("Error saving product category:", error.message);
      });
  };

  const deleteCategory = (categoryId) => {
    const apiUrl = `https://posbackendservice.clementechs.online/productCategory/delete`;
    const categoryData = {
      id: categoryId
    };
    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    };

    fetch(apiUrl, fetchOptions)
      .then(response => {
        if (response.ok) {
          // If the response status is OK (2xx), proceed with success actions
          console.log("Product category deleted successfully");

          // Show delete notification
          notification.success({
            message: "Product category deleted",
          });

          // Fetch categories again after deletion to update the list
          fetchCategories();
        } else {
          // If the response status is not OK, handle the error
          console.error(`Error deleting product category. Status: ${response.status}`);
        }
      })
      .catch(error => {
        // Handle other errors (e.g., network issues)
        console.error("Error deleting product category:", error.message);
      });
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => (
        <Button type="danger" onClick={() => deleteCategory(record.key)}>
          Delete
        </Button>
      ),
    },
  ];

  const data = ProdCategories.map(prodCategory => ({
    key: prodCategory.id,
    name: prodCategory.name,
  }));

  return (
    <TemplateLayout>
      <Content>
        <Row gutter={16}>
          <Col span={24}>
            <div>
              <h1 className="text-3xl font-semibold mb-4">Product Categories</h1>

              <Button type="primary" onClick={openModal} className="mb-4">
                Add Category
              </Button>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Create Category Modal"
                style={{
                  overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  },
                  content: {
                    margin: 'auto',
                    maxWidth: '400px', // Adjust the maximum width as needed
                    padding: 0,
                    maxHeight: 178, // Adjust the maximum height as needed
                  },
                }}
              >
                <div className="bg-white p-6 rounded shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
                  <Input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <Button onClick={createCategory} className="mr-2">
                      Create
                    </Button>
                    <Button onClick={closeModal}>Cancel</Button>
                  </div>
                </div>
              </Modal>

              <Table columns={columns} dataSource={data} />
            </div>
          </Col>
        </Row>
      </Content>
    </TemplateLayout>
  );
};

export default ProductCategory;
