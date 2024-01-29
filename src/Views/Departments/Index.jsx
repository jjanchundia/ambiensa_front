import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { sendRequest } from '../../functions';

const Department = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // Nuevo estado para almacenar el id editado

  useEffect(() => {
    // Lógica para cargar la lista de departamentos desde tu API
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await sendRequest("GET", '', 'api/departments', '');
      console.log(response);
      setData(response);
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    setEditingProductId(record.id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await sendRequest("DELETE", '', `api/departments/${id}`, '');
      message.success('Departamento eliminado correctamente');
      fetchDepartments();
    } catch (error) {
      console.error('Error al eliminar Departamento:', error);
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {        
        await sendRequest("PUT", values, `api/departments/${editingProductId}`, '');
        message.success('Departamento actualizado correctamente');
      } else {
        await sendRequest("POST", values, 'api/departments', '');
        message.success('Departamento creado correctamente');
      }

      setVisible(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error al guardar Departamento:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    {
      title: 'Acciones',
      dataIndex: '',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className='container mt-4'>
      <Button type="primary" onClick={() => { setVisible(true); setEditingProduct(null); }}>
        Nuevo departamento
      </Button>
      <Table dataSource={data} columns={columns} />

      <Modal
        title={editingProduct ? 'Editar Departamento' : 'Nuevo Departamento'}
        visible={visible}
        onCancel={() => { setVisible(false); setEditingProduct(null); }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Department;