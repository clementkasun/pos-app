import React, { useState } from "react";
import { Button, Table, Modal, Form, Input, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CurrencyAddPage = () => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);

  const showModal = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      currencyName: record.currencyName,
      symbol: record.symbol,
    });
    setEditingKey(record.key);
    setVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedData = dataSource.map((item) => {
        if (item.key === editingKey) {
          return { ...item, ...values };
        }
        return item;
      });

      setDataSource(updatedData);
      setEditingKey(null);
      setVisible(false);
    });
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      // Send a POST request to create a new currency
      fetch("http://127.0.0.1:5000/api/currencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currencyName: values.currencyName,
          symbol: values.symbol,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create currency");
          }
          return response.json();
        })
        .then((newCurrency) => {
          setDataSource([...dataSource, newCurrency]);
          setVisible(false);
        })
        .catch((error) => {
          // Handle errors, e.g., display an error message
          console.error("Error creating currency:", error);
        });
    });
  };

  const handleDelete = (record) => {
    const updatedData = dataSource.filter((item) => item.key !== record.key);
    setDataSource(updatedData);
  };

  const isEditing = (record) => record.key === editingKey;

  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "currencyName",
      editable: true,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button type="link" onClick={handleSave}>
              Save
            </Button>
            <Button type="link" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ float: "right", margin: "10px" }}>
        Create
      </Button>
      <Table dataSource={dataSource} columns={columns} pagination={false} />

      <Modal
        title={editingKey ? "Edit Currency" : "Create Currency"}
        visible={visible}
        onOk={editingKey ? handleSave : handleCreate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="currencyName"
            label="Currency Name"
            rules={[
              {
                required: true,
                message: "Please enter the currency name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="symbol"
            label="Symbol"
            rules={[
              {
                required: true,
                message: "Please enter the currency symbol!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CurrencyAddPage;
