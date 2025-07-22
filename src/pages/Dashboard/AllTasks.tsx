import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Typography, Row, Col, Button } from 'antd';
import Header from '../../components/Header/Header';
import TaskCard from '../../components/Dashboard/TaskCard';
import { mockTasks } from '../../data/mockData';
import { Task } from '../../types';

const { Content } = Layout;
const { Title } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AllTasks: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const category = query.get('category');

  const filteredTasks = category
    ? mockTasks.filter((task: Task) => task.task_category === category)
    : mockTasks;

  return (
    <Layout className="dashboard-layout" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header />
      <Content className="dashboard-content">
        <div className="dashboard-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>
              {category ? `${category} Tasks` : 'All Tasks'}
            </Title>
            <Button onClick={() => navigate(-1)} style={{ borderRadius: 8 }}>
              Back
            </Button>
          </div>
          <Row gutter={[24, 24]}>
            {filteredTasks.map((task) => (
              <Col xs={24} sm={12} md={8} lg={6} key={task.task_id}>
                <TaskCard task={task} />
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default AllTasks; 