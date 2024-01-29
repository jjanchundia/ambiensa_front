import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { sendRequest } from '../../functions';

const Employees = () => {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]); // Nuevo estado para departamentos
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingemployee, setEditingemployee] = useState(null);
  const [editingemployeeId, setEditingemployeeId] = useState(null);
  const [resetFormKey, setResetFormKey] = useState(0);

    useEffect(() => {
    fetchEmployees();
    fetchDepartments(); // Llamar a la función para obtener la lista de departamentos
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await sendRequest("GET", '', 'api/employeesall', '');
      setData(response);
    } catch (error) {
      console.error('Error al cargar Empleados:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await sendRequest("GET", '', 'api/departments', '');
      setDepartments(response);
    } catch (error) {
      console.error('Error al cargar Departamentos:', error);
    }
  };

  const handleCancel = () => {
    setEditingemployee(null); 
    form.setFieldsValue(null);

  };

  const handleEdit = (record) => {
    setEditingemployee(record);
    setEditingemployeeId(record.id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await sendRequest("DELETE", '', `api/employees/${id}`, '');
      message.success('Empleado eliminado correctamente');
      fetchEmployees();
    } catch (error) {
      console.error('Error al eliminar Empleado:', error);
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingemployee) {
        await sendRequest("PUT", values, `api/employees/${editingemployeeId}`, '');
        message.success('Empleado actualizado correctamente');
      } else {
        await sendRequest("POST", values, 'api/employees', '');
        message.success('Empleado creado correctamente');
      }

      setVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error al guardar Empleado:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Dirección', dataIndex: 'address', key: 'address' },
    { title: 'Telefono', dataIndex: 'phone', key: 'phone' },
    { title: 'Departamento', dataIndex: 'deparment', key: 'deparment' }, // Mostrar el nombre del departamento en lugar del ID
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
      <Button type="primary" onClick={() => { handleCancel(); setVisible(true); setEditingemployee(null); }}>
        Nuevo Empleado
      </Button>
      <Table dataSource={data} columns={columns} />

      <Modal
        title={editingemployee ? 'Editar Empleado' : 'Nuevo Empleado'}
        visible={visible}
        // onCancel={() => { setVisible(false); setEditingemployee(null); }}
        onCancel={() => { setVisible(false); setEditingemployee(null); setResetFormKey(prevKey => prevKey + 1); }}

        onOk={() => form.submit()}
      >
        <Form key={resetFormKey} form={form} onFinish={handleSave}>
          {/* Campos del formulario, por ejemplo: */}
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Dirección" name="address" rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Por favor ingresa el email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Telefono" name="phone" rules={[{ required: true, message: 'Por favor ingresa el telefono' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Departamento" name="department_id" rules={[{ required: true, message: 'Por favor selecciona el departamento' }]}>
            <Select>
              {departments.map((department) => (
                <Select.Option key={department.id} value={department.id}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
