import React, { useState } from 'react';
import './CreateTaskModal.css';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Divider,
  message 
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormValues) => void;
}

interface SubtaskField {
  id: string;
  name: string;
  description: string;
  instructions?: string;
}

interface TaskFormValues {
  task_name: string;
  category: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'One-Time';
  due_date: string | null;
  description?: string;
  subtasks: SubtaskField[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [subtasks, setSubtasks] = useState<SubtaskField[]>([]);

  const handleSubmit = (values: Omit<TaskFormValues, 'subtasks' | 'due_date'> & { due_date?: dayjs.Dayjs | null }) => {
    const taskData: TaskFormValues = {
      ...values,
      subtasks: subtasks,
      due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
    };
    
    onSubmit(taskData);
    message.success('Task created successfully!');
    form.resetFields();
    setSubtasks([]);
    onClose();
  };

  const addSubtask = () => {
    const newSubtask: SubtaskField = {
      id: `subtask-${Date.now()}`,
      name: '',
      description: '',
      instructions: '',
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const updateSubtask = (id: string, field: string, value: string) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, [field]: value } : subtask
    ));
  };

  return (
    <Modal
      title="Create New Task"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
      className="create-task-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="create-task-form"
      >
        <Form.Item
          name="task_name"
          label="Task Name"
          rules={[{ required: true, message: 'Please enter task name' }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select category">
            <Option value="Compliance">Compliance</Option>
            <Option value="Alerts & Monitoring">Alerts & Monitoring</Option>
            <Option value="Data Privacy">Data Privacy</Option>
            <Option value="Risk Management">Risk Management</Option>
            <Option value="Audit">Audit</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="frequency"
          label="Frequency"
          rules={[{ required: true, message: 'Please select frequency' }]}
        >
          <Select placeholder="Select frequency">
            <Option value="Daily">Daily</Option>
            <Option value="Weekly">Weekly</Option>
            <Option value="Monthly">Monthly</Option>
            <Option value="Quarterly">Quarterly</Option>
            <Option value="One-Time">One-Time</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="due_date"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            placeholder="Select due date"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea 
            rows={4} 
            placeholder="Enter task description"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Divider />

        <div className="subtasks-section">
          <div className="subtasks-header">
            <span className="subtasks-title">Subtasks</span>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={addSubtask}
              size="middle"
              className="add-subtask-btn"
            >
              Add Subtask
            </Button>
          </div>
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="subtask-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: '#6366f1', fontSize: 15 }}>Subtask {index + 1}</span>
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  size="small"
                  danger
                  onClick={() => removeSubtask(subtask.id)}
                  title="Delete subtask"
                />
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size={10}>
                <Input
                  placeholder="Subtask name"
                  value={subtask.name}
                  onChange={(e) => updateSubtask(subtask.id, 'name', e.target.value)}
                />
                <Input
                  placeholder="Subtask description"
                  value={subtask.description}
                  onChange={(e) => updateSubtask(subtask.id, 'description', e.target.value)}
                />
                <div>
                  <label className="subtask-instructions-label">Instructions</label>
                  <TextArea
                    rows={2}
                    placeholder="Enter instructions for this subtask"
                    value={subtask.instructions}
                    onChange={(e) => updateSubtask(subtask.id, 'instructions', e.target.value)}
                    showCount
                    maxLength={300}
                  />
                </div>
              </Space>
            </div>
          ))}
        </div>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Task
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;