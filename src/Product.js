import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import TemplateLayout from "./Layout.js";
import { Layout, Row, Col, Button, Input, Table, notification, Select } from "antd";
import 'tailwindcss/tailwind.css';

const { Content } = Layout;

Modal.setAppElement('#root');

const Product = () => {
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
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchProductCategories();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const apiUrl = "http://localhost:5000/api/products";

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error("Error fetching products:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchProductCategories = () => {
    const apiUrl = "http://localhost:5000/api/product-categories";

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProductCategories(data);
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
      reader.readAsDataURL(selectedFile);
    }
  };

  const createProduct = () => {
    if (productName && productCode && productPrice && stockNumber && skuNumber && productCategory) {
      saveProduct({
        name: productName,
        code: productCode,
        image: productImage,
        description: productDescription,
        price: productPrice,
        stock: stockNumber,
        sku: skuNumber,
        productCategory: productCategory
      });
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

  const saveProduct = () => {
    setLoading(true);
    const apiUrl = "http://localhost:5000/api/save-products";

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productCode', productCode);
    formData.append('productDescription', productDescription);
    formData.append('productPrice', productPrice);
    formData.append('skuNumber', skuNumber);
    formData.append('stockNumber', stockNumber);
    formData.append('productImage', productImage);
    formData.append('productCategory', productCategory);

    const fetchOptions = {
      method: "POST",
      body: formData,
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
        console.log("Product saved:", data);

        // Show save notification
        notification.success({
          message: "Product saved",
        });

        // Fetch products again after saving to update the list
        fetchProducts();
      })
      .catch(error => {
        console.error("Error saving product :", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
    <TemplateLayout>
      <Content>
        <Row gutter={16}>
          <Col span={24}>
            <div>
              <h1 className="text-3xl font-semibold mb-4">Products</h1>

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
                    margin: 'auto',
                    width: '80%',
                    height: '80%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  },
                }}
              >
                <div className="bg-white p-6 rounded shadow-md h-full">
                  <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product Name"
                        className="mb-4"
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
                        {productCategories.map(category => (
                          <Select.Option key={category.id} value={category.id}>
                            {category.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <input
                        type="file"
                        onChange={handleFileInputChange}
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

export default Product;
