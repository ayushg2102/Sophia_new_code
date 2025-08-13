import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Progress,
  Input,
  Select,
  message,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  SyncOutlined,
  UserOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./TaskView.css";
import { Action, Subtask, Task } from "../../types";
import dayjs from "dayjs";
import "./TaskView.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const TaskView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/sub-task-details/${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch task details');
        const data = await response.json();
        console.log(data,"response123")
        const apiTask = data.data;
        console.log(apiTask,"apiTask")
        setTask({
          task_id: apiTask.task_id,
          task_category: apiTask.task_category,
          task_short_description: apiTask.task_short_description,
          frequency: apiTask.frequency,
          task_due_date: apiTask.task_due_date,
          status: apiTask.status || 'active',
          description: apiTask.description,
          subtasks: apiTask.subtasks || [],
          actions: apiTask.actions || [],
        });
        console.log(task?.actions,"task1231")
        console.log(task?.actions?.map((action_instruction) => action_instruction.action_instruction),"action123")
      } catch {
        setError('Could not load task details. Please try again.');
        setTask(null);
      } finally {
        setLoading(false);
      }
    };
    if (taskId) fetchTaskDetail();
  }, [taskId]);

  const handleEdit = (subtask: Subtask) => {
    setEditingId(subtask.subtask_id);
    setEditedName(subtask.subtask_short_description);
  };

  const handleSave = (subtaskId: string) => {
    if (!editedName.trim()) {
      message.error('Subtask name cannot be empty');
      return;
    }

    const updatedTasks = task?.subtasks?.map(s => 
      s.subtask_id === subtaskId 
        ? { ...s, subtask_short_description: editedName }
        : s
    );
    setTask(prev => prev ? { ...prev, subtasks: updatedTasks } : null);
    setEditingId(null);
    message.success('Subtask updated successfully');
  };

  const handleStatusChange = (subtaskId: string, newStatus: 'completed' | 'in-progress' | 'due') => {
    const updatedTasks = task?.subtasks?.map(s => 
      s.subtask_id === subtaskId 
        ? { ...s, status: newStatus }
        : s
    );
    setTask(prev => prev ? { ...prev, subtasks: updatedTasks } : null);
    message.success('Status updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  if (loading) {
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "24px" }}>
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "24px" }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </Content>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <Header />
        <Content style={{ padding: "24px" }}>
          <div>Task not found</div>
        </Content>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "in-progress":
        return "blue";
      case "due":
        return "orange";
      default:
        return "default";
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <Layout className="task-view-layout">
      <Header />
      <Content className="task-view-content">
        <div className="task-view-container">
          <div className="task-view-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBackClick}
              className="back-button"
            >
              Back to Dashboard
            </Button>
          </div>

          <Card className="task-info-card">
            <div className="task-info-header">
              <div>
                <Title level={2} className="task-title">
                  {task.task_short_description}
                </Title>
                <Text className="task-category">{task.task_category}</Text>
              </div>
              <div className="task-tags">
                <Tag color={getStatusColor(task.status)} className="status-tag">
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Tag>
                <Tag color="yellow" className="frequency-tag">
                  {task.frequency}
                </Tag>
              </div>
            </div>

            <div className="task-progress">
              <div className="progress-status">
                {task.subtasks?.filter(subtask => subtask.status === 'completed').length || 0}/
                {task.subtasks?.length || 0} subtasks completed
              </div>
              <Progress 
                percent={Math.round(((task.subtasks?.filter(subtask => subtask.status === 'completed').length || 0) / (task.subtasks?.length || 1)) * 100)} 
                showInfo={false}
                strokeColor="#1890ff"
                trailColor="#f0f0f0"
                strokeWidth={8}
              />
            </div>

            {/* <Divider /> */}
            {task.description && (
              <>
                <Divider />
                <div className="task-description">
                  <Title level={4}>Description</Title>
                  <Text>{task.description}</Text>
                </div>
              </>
            )}
            <Row gutter={[24, 16]} className="task-details">
              {/* <Col xs={24} sm={12} md={6}>
                <div className="task-detail-item">
                  <CalendarOutlined className="detail-icon" />
                  <div>
                    <Text strong>Renewal Date</Text>
                    <br />
                    <Text>
                      {task.renewal_date ? dayjs(task.renewal_date).format("MM/DD/-YYYY") : '01/21/2025'}
                    </Text>
                  </div>
                </div>
              </Col> */}
              <Col xs={24} sm={12} md={6}>
                <div className="task-detail-item">
                  <SyncOutlined className="detail-icon" />
                  <div>
                    <Text strong>Frequency</Text>
                    <br />
                    <Text>{task.frequency || 'N/A'}</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="task-detail-item">
                  <UserOutlined className="detail-icon" />
                  <div>
                    <Text strong>Sub-tasks</Text>
                    <br />
                    <Text>{task.subtasks?.length || 0} tasks</Text>
                  </div>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={6}>
                <div className="task-detail-item">
                  <CalendarOutlined className="detail-icon" />
                  <div>
                    <Text strong>Last Run</Text>
                    <br />
                    <Text>
                      {task.last_run_date ? dayjs(task.last_run_date).format("MM/DD/YYYY") : '01/21/2025'}
                    </Text>
                  </div>
                </div>
              </Col> */}
            </Row>
          </Card>

          <Row gutter={24}>
            <Col span={12}>
              <Card className="subtasks-card">
                <Title level={3} className="subtasks-title">
                  Subtasks
                </Title>

                <div className="subtasks-list subtasks-list-scroll">
                  {task.subtasks?.map((subtask: Subtask) => (
                    <Card
                      key={subtask.subtask_id}
                      className="subtask-card"
                      // hoverable
                      // onClick={() => handleSubtaskCardClick(subtask.subtask_id)}
                    >
                      <div className="subtask-header">
                        <div className="subtask-info">
                          <div className="subtask-title-container">
                            {editingId === subtask.subtask_id ? (
                              <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onPressEnter={() => handleSave(subtask.subtask_id)}
                                autoFocus
                                style={{ marginRight: 8, flex: 1 }}
                              />
                            ) : (
                              <Title level={5} className="subtask-title">
                                {subtask.subtask_short_description}
                              </Title>
                            )}
                          </div>
                          <div className="subtask-tags">
                            {editingId === subtask.subtask_id ? (
                              <>
                                <Select
                                  value={subtask.status}
                                  onChange={(value) => handleStatusChange(subtask.subtask_id, value)}
                                  style={{ width: 120, marginRight: 8 }}
                                  size="small"
                                  dropdownMatchSelectWidth={false}
                                >
                                  <Select.Option value="completed">Completed</Select.Option>
                                  <Select.Option value="in-progress">In Progress</Select.Option>
                                  <Select.Option value="due">Due</Select.Option>
                                </Select>
                              </>
                            ) : (
                              <>
                                <Tag 
                                  color={getStatusColor(subtask.status)}
                                  className="subtask-status"
                                  style={{
                                    backgroundColor: subtask.status === 'completed' ? '#f6ffed' : 'inherit',
                                    borderColor: subtask.status === 'completed' ? '#b7eb8f' : 'd9d9d9',
                                    color: subtask.status === 'completed' ? '#52c41a' : 'inherit',
                                    marginRight: 8
                                  }}
                                >
                                  {subtask.status.charAt(0).toUpperCase() + subtask.status.slice(1)}
                                </Tag>
                                <Tag color="blue">Auto-Generated</Tag>
                              </>
                            )}
                          </div>
                          <div className="subtask-actions">
                            {editingId === subtask.subtask_id ? (
                              <>
                                <Button 
                                  type="text" 
                                  icon={<CheckOutlined />} 
                                  onClick={() => handleSave(subtask.subtask_id)}
                                  size="small"
                                />
                                <Button 
                                  type="text" 
                                  icon={<CloseOutlined />} 
                                  onClick={handleCancel}
                                  size="small"
                                />
                              </>
                            ) : (
                              <Button 
                                type="text" 
                                icon={<EditOutlined />} 
                                onClick={() => handleEdit(subtask)}
                                size="small"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <Space
                        direction="vertical"
                        size={4}
                        className="subtask-details"
                      >
                        <Text type="secondary">
                          <CalendarOutlined /> Due: {subtask.due_date ? dayjs(subtask.due_date).format("MM/DD/YYYY") : 'N/A'}
                        </Text>
                        {subtask.period_considered && (
                          <Text type="secondary">
                            <CalendarOutlined /> Period: {subtask.period_considered}
                          </Text>
                        )}
                        {subtask.employees_analyzed && (
                          <Text type="secondary">
                            <UserOutlined /> Employees: {subtask.employees_analyzed}
                          </Text>
                        )}
                        {subtask.duration && (
                          <Text type="secondary">Duration: {subtask.duration}</Text>
                        )}
                      </Space>
                    </Card>
                  ))}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="subtasks-card">
                <Title level={3} className="subtasks-title">
                  Actions
                </Title>

                <div className="subtasks-list actions-list-scroll">
                  {task.actions?.map((action: any) => (
                    <Card
                      key={action.action_id}
                      className="action-card"
                      style={{ marginBottom: 16 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <Title level={5} style={{ marginBottom: 8 }}>
                            {action.action_instruction ? action.action_instruction.split('\n')[0] : ''}
                          </Title>
                          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                            {task.frequency || "Quarterly on 15th"}
                          </Text>
                          
                          <Text 
                            style={{ 
                              display: '-webkit-box',
                              color: '#666', 
                              marginBottom: 16,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}

                            title={action.action_instruction ? action.action_instruction.split('\n').slice(1).join('\n') : ''}
                          >
                            {action.action_instruction 
                              ? action.action_instruction.split('\n').slice(1).join(' ').split(' ').slice(0, 50).join(' ')
                              : ''}
                            {action.action_instruction && action.action_instruction.split('\n').slice(1).join(' ').split(' ').length > 50 ? '...' : ''}
                          </Text>
                        </div>
                        <Tag color="#1890ff" style={{ borderRadius: 16, padding: '0 12px', height: '24px', lineHeight: '24px' }}>
                          Configured
                        </Tag>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        {(action.tools_used || []).map((tool: string) => (
                          <>
                          <Tag key={tool} style={{ margin: 0, borderRadius: 4 }}>
                            {tool}
                          </Tag>
                          
                          </>
                          
                        ))}
                        <Tag color="blue" style={{ margin: 0, borderRadius: 4 }}>
                            Relative
                          </Tag>
                      </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8,marginTop:'20px',float:'right' }}>
                        <Button
                          type="primary"
                          size="middle"
                          icon={<i className="fas fa-cog" />}
                          style={{ 
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/action/${action.action_id}`, { state: { taskName: task.task_short_description, actionId: action.action_id, instructions: action.action_instruction } });
                          }}
                        >
                          View Details
                        </Button>
                        
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TaskView;
