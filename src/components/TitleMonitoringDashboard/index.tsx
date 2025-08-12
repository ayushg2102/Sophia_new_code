import React, { useState, useMemo, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Typography,
  Card, 
  Select, 
  Input, 
  Button, 
  Table, 
  message,
  Badge,

} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
const { Title } = Typography;
import dayjs from 'dayjs';
import SocialMediaMonitoringDashboard from '../SocialMediaContributions/SocialMediaMonitoringDashboard';


const { Option } = Select;

interface TitleRecord {
  key: string;
  name: string;
  platform: string;
  titleHr: string;
  titleLinkedIn: string;
  category: 'Title Matching' | 'Title Not Matching';
  runDate: string;
}

interface DocumentData {
  _id: string;
  created_at: string;
  updated_at: string;
  duration: number;
  period: string;
  run_id: string;
  output: any[];
}

// API fetch function
const fetchSocialMediaCompliance = async (): Promise<DocumentData[]> => {
  try {
    const response = await fetch('https://sophia.xponance.com/api/collection/social-media-compliance');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data.documents || [];
  } catch (error) {
    console.error('Error fetching social media compliance data:', error);
    throw error;
  }
};

// Transform data for title monitoring
const transformTitleDataFromDocument = (document: DocumentData): TitleRecord[] => {
  if (!document.output || !Array.isArray(document.output)) {
    return [];
  }
  
  return document.output.map((item, index) => ({
    key: `${document._id}-${index}`,
    name: item.employee_name || 'N/A',
    platform: 'LinkedIn', // Default platform
    titleHr: item['Title as per HR'] || 'N/A',
    titleLinkedIn: item['Title as per LinkedIn'] || 'N/A',
    category: (item['Title Category'] === 'Title Matching' ? 'Title Matching' : 'Title Not Matching') as 'Title Matching' | 'Title Not Matching',
    runDate: document.period || 'N/A'
  }));
};

// Format period helper
const formatPeriod = (period: string): string => {
  if (!period) return 'N/A';
  const parts = period.split(' to ');
  if (parts.length === 2) {
    const startDate = dayjs(parts[0]).format('MMM D, YYYY');
    const endDate = dayjs(parts[1]).format('MMM D, YYYY');
    return `${startDate} - ${endDate}`;
  }
  return period;
};



const TitleMonitoringDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [runDateFilter, setRunDateFilter] = useState<string>('All');
  const [monitoringType, setMonitoringType] = useState<string>('Title Monitoring');
  const [titleData, setTitleData] = useState<TitleRecord[]>([]);
  const [runDates, setRunDates] = useState<{label: string, value: string}[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  
  // Load and transform data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const documents = await fetchSocialMediaCompliance();
        setAllDocuments(documents);
        
        // Create run date options from documents
        const runDateOptions = documents.map(doc => ({
          label: `${dayjs(doc.created_at).format('MMM D, YYYY')} - ${formatPeriod(doc.period)}`,
          value: doc._id
        }));
        
        setRunDates([{ label: 'All Runs', value: 'All' }, ...runDateOptions]);
        
        // Auto-select the last document and transform its data
        if (documents.length > 0) {
          const lastDocument = documents[documents.length - 1];
          const lastDocData = transformTitleDataFromDocument(lastDocument);
          
          setTitleData(lastDocData);
          setSelectedDocument(lastDocument);
          setRunDateFilter(lastDocument._id);
        } else {
          // Fallback to empty data if no documents
          setTitleData([]);
          setRunDateFilter('All');
        }
        
        message.success('Title monitoring data loaded successfully');
      } catch (error) {
        console.error('Error loading title monitoring data:', error);
        message.error('Failed to load title monitoring data');
        // Set empty data on error
        setTitleData([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle run date filter change
  useEffect(() => {
    if (runDateFilter === 'All') {
      // Show all data from all documents
      const allData = allDocuments.flatMap(doc => transformTitleDataFromDocument(doc));
      setTitleData(allData);
      setSelectedDocument(null);
    } else {
      // Show data from selected document
      const selectedDoc = allDocuments.find(doc => doc._id === runDateFilter);
      if (selectedDoc) {
        const docData = transformTitleDataFromDocument(selectedDoc);
        setTitleData(docData);
        setSelectedDocument(selectedDoc);
      }
    }
  }, [runDateFilter, allDocuments]);
  


  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return titleData.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.titleHr.toLowerCase().includes(searchText.toLowerCase()) ||
        item.titleLinkedIn.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [titleData, searchText, categoryFilter]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleRunDateChange = (value: string) => {
    setRunDateFilter(value);
  };
  const changeMonitoringType = (value: string) => {
    setMonitoringType(value);
  };

  const handleFreshRun = async () => {
    try {
      setLoading(true);
      const documents = await fetchSocialMediaCompliance();
      setAllDocuments(documents);
      
      // Create run date options from created_at values
      const runDateOptions = documents.map(doc => ({
        label: `${dayjs(doc.created_at).format('MMM D, YYYY')} - ${formatPeriod(doc.period)}`,
        value: doc._id
      }));
      
      setRunDates([{ label: 'All Runs', value: 'All' }, ...runDateOptions]);
      
      // Auto-select the last document after refresh
      if (documents.length > 0) {
        const lastDocument = documents[documents.length - 1];
        const lastDocData = transformTitleDataFromDocument(lastDocument);
        
        setTitleData(lastDocData);
        setSelectedDocument(lastDocument);
        setRunDateFilter(lastDocument._id);
      } else {
        // Reset to show all data if no documents
        setRunDateFilter('All');
      }
      
      message.success('Title monitoring data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing title monitoring data:', error);
      message.error('Failed to refresh title monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: TitleRecord, b: TitleRecord) => a.name.localeCompare(b.name),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      filters: [
        { text: 'LinkedIn', value: 'LinkedIn' },
        // Add other platforms as needed
      ],
      onFilter: (value: any, record: TitleRecord) => record.platform === value,
    },
    {
      title: 'Title as per HR',
      dataIndex: 'titleHr',
      key: 'titleHr',
      sorter: (a: TitleRecord, b: TitleRecord) => a.titleHr.localeCompare(b.titleHr),
    },
    {
      title: 'Title as per LinkedIn',
      dataIndex: 'titleLinkedIn',
      key: 'titleLinkedIn',
      sorter: (a: TitleRecord, b: TitleRecord) => a.titleLinkedIn.localeCompare(b.titleLinkedIn),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Title Matching', value: 'Title Matching' },
        { text: 'Title Not Matching', value: 'Title Not Matching' },
      ],
      onFilter: (value: any, record: TitleRecord) => record.category === value,
      render: (category: string) => (
        <span style={{ 
          color: category === 'Title Matching' ? '#52c41a' : '#f5222d',
          fontWeight: 500
        }}>
          {category}
        </span>
      ),
    },
  ];

  // Return the SocialMediaMonitoringDashboard when monitoringType is 'Post Monitoring'
  if (monitoringType === 'Post Monitoring') {
    return <SocialMediaMonitoringDashboard />;
  }

  // Otherwise, return the Title Monitoring dashboard
  return (
    <div style={{ width: '100%' }}>
     <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
          <Col xs={24} md={8}>
            <Select
              value={runDateFilter}
              style={{ width: '100%' }}
              onChange={handleRunDateChange}
            >
              <Option value="All">All Run Dates</Option>
              {runDates.map(date => (
                <Option key={date.value} value={date.value}>
                  {date.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Input.Search
              placeholder="Search employees..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleFreshRun}
            >
              Execute Fresh Run
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between">
          <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
            <Card title="Started At" size="small" style={{ height: '100%', margin: 0 }}>
              <div style={{ fontSize: '0.9rem' }}>
                {selectedDocument ? dayjs(selectedDocument.created_at).format('MM/DD/YYYY HH:mm') : dayjs().format('MM/DD/YYYY HH:mm')}
              </div>
            </Card>
          </Col>
          <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
            <Card title="Completed At" size="small" style={{ height: '100%', margin: 0 }}>
              <div style={{ fontSize: '0.9rem' }}>
                {selectedDocument ? dayjs(selectedDocument.updated_at).format('MM/DD/YYYY HH:mm') : dayjs().add(20, 'minute').format('MM/DD/YYYY HH:mm')}
              </div>
            </Card>
          </Col>
          <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
            <Card title="Duration" size="small" style={{ height: '100%', margin: 0 }}>
              <div style={{ fontSize: '0.9rem' }}>
                {selectedDocument ? `${Math.floor(selectedDocument.duration / 60)} min ${Math.floor(selectedDocument.duration % 60)} sec` : '18 min 14 sec'}
              </div>
            </Card>
          </Col>
          <Col flex="1" style={{ minWidth: '180px', padding: '0 8px' }}>
            <Card title="Period Considered" size="small" style={{ height: '100%', margin: 0 }}>
              <div style={{ fontSize: '0.9rem' }}>
                {selectedDocument ? formatPeriod(selectedDocument.period) : 'Jul 1, 2025 - Jun 30, 2025'}
              </div>
            </Card>
          </Col>
          <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
            <Card title="Employees Analyzed" size="small" style={{ height: '100%', margin: 0 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                {titleData.length}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Title Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Social Media Monitoring - Analysis Run</Title>
          </Col>
          <Col>
            <Badge status="success" text="Completed" />
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between">
                  <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
                    <Card title="Started At" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>{dayjs().format('MM/DD/YYYY HH:mm')}</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '160px', padding: '0 8px' }}>
                    <Card title="Completed At" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>{dayjs().add(20, 'minute').format('MM/DD/YYYY HH:mm')}</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
                    <Card title="Duration" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>19 min 58 sec</div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
                    <Card title="Employees Analyzed" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>43</div>
                    </Card>
                  </Col>
                </Row>
<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Monitoring Type</label>
              <Select
                style={{ width: '100%' }}
                value={monitoringType}
                onChange={(value) => {
                  changeMonitoringType(value);
                  }}
              >
                <Option value="Title Monitoring">Title Monitoring</Option>
                <Option value="Post Monitoring">Post Monitoring</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Category</label>
              <Select
                style={{ width: '100%' }}
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <Option value="All">All</Option>
                <Option value="Title Matching">Title Matching</Option>
                <Option value="Title Not Matching">Title Not Matching</Option>
              </Select>
            </div>
          </Col>
          
        </Row>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 'max-content' }}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default TitleMonitoringDashboard;
