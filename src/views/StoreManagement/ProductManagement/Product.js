/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Button, Input, Table, notification, Select, Image, Form } from "antd";

import Modal from 'react-modal';

// reactstrap components
import {
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  UncontrolledTooltip,
} from "reactstrap";

const { Content } = Layout;
const FormItem = Form.Item;

function Product(props) {
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [skuNumber, setSkuNumber] = useState('');
  const [stockNumber, setStockNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ProdCategories, setProdCategories] = useState([]);
  const [isProdNameExist, setProdNameExist] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchProductCategories();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const apiUrl = "https://posbackendservice.clementechs.online/product/getProducts";

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products);
      })
      .catch(error => {
        console.error("Error fetching products:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchProductCategories = () => {
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

  const handleFileInputChange = (e) => {
    if (e && e.target && e.target.files) {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result.startsWith('data:image/')) {
            setProductImage(selectedFile);
          } else {
            console.error('Invalid file type. Please select an image.');
          }
        };

        reader.onerror = () => {
          console.error('Error reading the file. Please try again.');
        };

        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const createProduct = () => {
    if (productName && productCode && productPrice && stockNumber && skuNumber && productCategory && productImage) {
      setLoading(true);
      saveProduct(productImage);
      // Reset state variables
      setProductName('');
      setProductCode('');
      setProductImage(null);
      setProductDescription('');
      setProductPrice('');
      setSkuNumber('');
      setStockNumber('');
      setProductCategory('');
      closeModal();
    }
  };

  const saveProduct = (file) => {
    const apiUrl = "https://posbackendservice.clementechs.online/product/create";

    const requestBody = {
      name: productName,
      code: productCode,
      description: productDescription,
      price: productPrice,
      sku: skuNumber,
      stock: stockNumber,
      productCategory,
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(requestBody));

    const fetchOptions = {
      method: "POST",
      body: formData,
    };

    fetch(apiUrl, fetchOptions)
      .then(response => response.json())
      .then(data => {
        fetchProducts()
        // Show delete notification
      })
      .catch(error => {
      });
  };

  const checkProductNameExist = async (prodName) => {
    const apiUrl = `http://localhost:7073/product/checkProductNameExist`;

    try {
      const checkData = {
        prodName: prodName
      };

      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(checkData)
      };

      const response = await fetch(apiUrl, fetchOptions);

      if (response.ok) {
        const data = await response.json();
        if (data.isExist == true) {
          setProdNameExist(data.isExist);
        }
      } else {
        console.error(`Error checking the product name. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error checking the product name:", error.message);
    }
  };

  const deleteProduct = (prodId) => {
    const apiUrl = `https://posbackendservice.clementechs.online/product/delete`;
    const prodData = {
      id: prodId
    };
    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prodData)
    };

    fetch(apiUrl, fetchOptions)
      .then(response => {
        if (response.ok) {
          // If the response status is OK (2xx), proceed with success actions
          console.log("Product category deleted successfully");

          // Show delete notification
          // Fetch categories again after deletion to update the list
          fetchProducts();
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (
        index + 1
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record, index) => {
        if (record && record.image) {
          const imagePath = record.image.replace(/\\/g, '/');
          console.log('Image Path:', imagePath); // Log the image path to the console for debugging
          return <Image width={200} src={imagePath} alt={record.name} />;
        }
        console.error('Invalid record or image data:', record);
        return null; // or provide a default image or placeholder
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock Number',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Sku Number',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Product Category',
      dataIndex: 'productCategory',
      key: 'productCategory',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => (
        <Button type="danger" onClick={() => deleteProduct(record.key)}>
          Delete
        </Button>
      ),
    },
  ];

  

  const data = products.map(product => ({
    key: product.id,
    name: product.name,
    code: product.code,
    description: product.description,
    price: product.price,
    stock: product.stock,
    sku: product.sku,
    productCategory: product.productCategory,
  }));

  return (
    <>
      <div className="content">
        <Row gutter={16}>
          <Col span={24}>
            <Button type="primary" onClick={openModal} className="mb-4">
              Add Product
            </Button>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Create Product Modal"
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                  marginLeft: '215px',
                  marginTop: '10px',
                  width: '80%',
                  height: '80%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                },
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Input
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      checkProductNameExist(e.target.value);
                    }}
                    placeholder="Product Name"
                    className="mb-4"
                    style={{ borderColor: (isProdNameExist == true) ? 'red' : null }}
                  />
                </Col>
                <Col span={8}>
                  <Select
                    value={productCategory}
                    onChange={(value) => setProductCategory(value)}
                    placeholder="Select Product Category"
                    className="mb-4"
                    style={{ width: '100%' }}
                  >
                    {ProdCategories.map(category => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Input
                    type="file"
                    onChange={(e) => handleFileInputChange(e)}
                    placeholder="Product Image"
                    className="mb-4"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="Product Code"
                    className="mb-4"
                  />
                </Col>
                <Col span={8}>
                  <Input
                    type="text"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Product Description"
                    className="mb-4"
                  />
                </Col>
                <Col span={8}>
                  <Input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Product Price"
                    className="mb-4"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Input
                    type="text"
                    value={skuNumber}
                    onChange={(e) => setSkuNumber(e.target.value)}
                    placeholder="SKU Number"
                    className="mb-4"
                  />
                </Col>
                <Col span={8}>
                  <Input
                    type="number"
                    value={stockNumber}
                    onChange={(e) => setStockNumber(e.target.value)}
                    placeholder="Stock Amount"
                    className="mb-4"
                  />
                </Col>
              </Row>
              <Button onClick={createProduct} className="mr-2" loading={loading}>
                Create
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </Modal>

            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Product;
