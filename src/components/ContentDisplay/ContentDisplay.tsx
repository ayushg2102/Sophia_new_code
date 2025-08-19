import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import { API_CONFIG } from '../../constants/api';
import './ContentDisplay.css';

const { Content } = Layout;
const { Title } = Typography;

interface ContentDisplayProps {}

interface ReportData {
  title: string;
  html_content: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Get run_id from location state
  const runId = location.state?.run_id;

  useEffect(() => {
    const fetchReportData = async () => {
      if (!runId) {
        message.error('No run ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_CONFIG.ENDPOINTS.REPORT(runId));
        
        if (response.ok) {
          const apiResponse = await response.json();
          
          if (apiResponse.status === 'success' && apiResponse.data) {
            setReportData({
              title: apiResponse.data.title,
              html_content: apiResponse.data.html_content
            });
          } else {
            throw new Error('Invalid API response format');
          }
        } else {
          throw new Error('Failed to fetch report data');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        message.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [runId]);

  const handleBackClick = () => {
      navigate(-1);
  };

  if (loading) {
    return (
      <Layout className="content-display-layout">
        <Header />
        <Content className="content-display-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="content-display-layout">
      <Header />
      <Content className="content-display-content">
        {/* Back Button */}
        <div className="content-display-back">
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>

        {/* Main Content Card */}
        <Card className="content-display-card">
          {/* Title */}
          <div className="content-display-header">
            <Title 
              level={3} 
              className="content-display-title"
            >
              {reportData?.title || 'Report'}
            </Title>
          </div>
          
          {/* HTML Content */}
          <div 
            className="content-display-body"
            dangerouslySetInnerHTML={{ __html: reportData?.html_content || '' }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default ContentDisplay;