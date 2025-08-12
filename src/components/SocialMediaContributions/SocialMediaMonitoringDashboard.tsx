import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Table, Card, Row, Col, Typography, Badge, Select, Input, Button, 
  Spin, Tag, Empty, message 
} from 'antd';
import { 
  LinkedinOutlined, TwitterOutlined, FacebookOutlined, 
  SearchOutlined, ReloadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TitleMonitoringDashboard from '../TitleMonitoringDashboard';

const { Title } = Typography;
const { Option } = Select;

// API endpoint for social media compliance
const API_ENDPOINT = 'https://sophia.xponance.com/api/collection/social-media-compliance';

// Interface definitions
interface SocialMediaData {
  key: string;
  employee_name: string;
  platform: string;
  trigger_phrase: string;
  keywords_hit: string;
  category_name: string;
  violation: string;
  linkedin_url: string;
  posted_at: string;
  total_posts: number;
  documentId: string;
  runDate: string;
}

interface DocumentData {
  _id: string;
  created_at: string;
  updated_at: string;
  period: string;
  duration: number;
  run_id: string;
  output: any[];
}

// Helper function to format period string
const formatPeriod = (period: string): string => {
  if (!period || !period.includes(' to ')) return period;
  
  const [startDate, endDate] = period.split(' to ');
  
  const formatDate = (dateStr: string): string => {
    const date = dayjs(dateStr.trim());
    return date.isValid() ? date.format('MMM D, YYYY') : dateStr;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Helper function to transform API data to table format for a specific document
const transformSocialMediaFromDocument = (doc: DocumentData): SocialMediaData[] => {
  if (!doc || !Array.isArray(doc.output)) return [];
  
  const socialMediaData: SocialMediaData[] = [];
  
  doc.output.forEach((item: any, index: number) => {
    if (!item?.employee_name) return;
    
    const employeeName = String(item.employee_name || 'Unknown');
    const platform = item.linkedin_url ? 'LinkedIn' : 'Social Media';
    const triggerPhrase = item.trigger_phrase || 'No posts available';
    const category = item.category_name || 'No posts available';
    const keywordsHit = item.keywords_hit || '[]';
    const violation = item.violation || 'Unknown';
    const linkedinUrl = item.linkedin_url || '';
    const postedAt = item.posted_at || 'No posted_at found';
    const totalPosts = item.total_posts || 0;
    
    socialMediaData.push({
      key: `${doc._id}_${employeeName}_${index}`,
      employee_name: employeeName,
      platform: platform,
      trigger_phrase: triggerPhrase,
      keywords_hit: keywordsHit,
      category_name: category,
      violation: violation,
      linkedin_url: linkedinUrl,
      posted_at: postedAt,
      total_posts: totalPosts,
      documentId: doc._id,
      runDate: dayjs(doc.created_at).format('MMM D, YYYY')
    });
  });
  
  return socialMediaData;
};

// Function to fetch social media compliance data from API
const fetchSocialMediaCompliance = async (): Promise<DocumentData[]> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result?.data?.documents || [];
  } catch (error) {
    console.error('Error fetching social media compliance:', error);
    throw error;
  }
};

// Mock data for fallback (matching API structure)
const mockData: SocialMediaData[] = [
  {
    key: '1',
    employee_name: 'John Smith',
    platform: 'LinkedIn',
    trigger_phrase: 'Market analysis post',
    keywords_hit: '["Investment", "Market", "Analysis"]',
    category_name: 'Financial Commentary',
    violation: 'Yes',
    linkedin_url: 'https://linkedin.com/in/johnsmith',
    posted_at: '2025-05-06 17:15:10',
    total_posts: 3,
    documentId: 'mock1',
    runDate: 'Jul 29, 2025'
  },
  {
    key: '2',
    employee_name: 'Jane Doe',
    platform: 'LinkedIn',
    trigger_phrase: 'No posts available',
    keywords_hit: '[]',
    category_name: 'No posts available',
    violation: 'No posts available',
    linkedin_url: 'https://linkedin.com/in/janedoe',
    posted_at: 'No posted_at found',
    total_posts: 0,
    documentId: 'mock2',
    runDate: 'Jul 29, 2025'
  }
];

const SocialMediaMonitoringDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [keywordsFilter, setKeywordsFilter] = useState('All');
  const [biasFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [monitoringType, setMonitoringType] = useState('Post Monitoring');
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaData[]>([]);
  const [runDates, setRunDates] = useState<{label: string, value: string}[]>([]);
  const [runDateFilter, setRunDateFilter] = useState<string>('All');
  const [allDocuments, setAllDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);

  // Load and transform data on component mount
  useEffect(() => {
    const loadData = async () => {
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
        
        // Auto-select the last document and load its data
        if (documents.length > 0) {
          const lastDocument = documents[documents.length - 1];
          const lastDocData = transformSocialMediaFromDocument(lastDocument);
          
          setSocialMediaData(lastDocData);
          setSelectedDocument(lastDocument);
          setRunDateFilter(lastDocument._id);
        } else {
          // Fallback: Load all data if no documents
          const allData: SocialMediaData[] = [];
          documents.forEach(doc => {
            const docData = transformSocialMediaFromDocument(doc);
            allData.push(...docData);
          });
          
          setSocialMediaData(allData);
        }
        
        if (documents.length > 0) {
          const lastDocument = documents[documents.length - 1];
          const lastDocData = transformSocialMediaFromDocument(lastDocument);
          message.success(`Loaded ${documents.length} document runs, showing latest run with ${lastDocData.length} social media records`);
        }
      } catch (error) {
        console.error('Error loading social media compliance:', error);
        message.error('Failed to load social media compliance data from API');
        // Fallback to mock data on error
        setSocialMediaData(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter data based on selected run date
  useEffect(() => {
    if (runDateFilter === 'All') {
      // Show all data from all documents
      const allData: SocialMediaData[] = [];
      allDocuments.forEach(doc => {
        const docData = transformSocialMediaFromDocument(doc);
        allData.push(...docData);
      });
      setSocialMediaData(allData);
      setSelectedDocument(null);
    } else {
      // Show data from selected document only
      const selectedDoc = allDocuments.find(doc => doc._id === runDateFilter);
      if (selectedDoc) {
        const docData = transformSocialMediaFromDocument(selectedDoc);
        setSocialMediaData(docData);
        setSelectedDocument(selectedDoc);
      }
    }
  }, [runDateFilter, allDocuments]);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchText]);



  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return socialMediaData.filter(item => {
      const matchesSearch = item.employee_name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                           (item.trigger_phrase && item.trigger_phrase.toLowerCase().includes(debouncedSearchText.toLowerCase()));
      
      // Parse keywords_hit JSON string and check if any selected keywords match
      let matchesKeywords = keywordsFilter === 'All';
      if (!matchesKeywords && keywordsFilter !== 'All') {
        try {
          const keywords = JSON.parse(item.keywords_hit || '[]');
          const selectedKeywords = keywordsFilter.split(',').map(k => k.trim());
          matchesKeywords = selectedKeywords.some(selectedKeyword => 
            keywords.some((keyword: string) => keyword.toLowerCase().includes(selectedKeyword.toLowerCase()))
          );
        } catch {
          matchesKeywords = false;
        }
      }
      
      const matchesBias = biasFilter === 'All' || 
                         (item.violation && item.violation === biasFilter);
      
      return matchesSearch && matchesKeywords && matchesBias;
    });
  }, [socialMediaData, debouncedSearchText, keywordsFilter, biasFilter]);

  // Handle table change (pagination, sorting)
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Handler for search change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  }, []);

  // Handler for fresh run
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
        const lastDocData = transformSocialMediaFromDocument(lastDocument);
        
        setSocialMediaData(lastDocData);
        setSelectedDocument(lastDocument);
        setRunDateFilter(lastDocument._id);
      } else {
        // Reset to show all data if no documents
        setRunDateFilter('All');
      }
      
      message.success('Social media compliance data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing social media compliance:', error);
      message.error('Failed to refresh social media compliance data');
    } finally {
      setLoading(false);
    }
  };

  // Handler for run date change
  const handleRunDateChange = (value: string) => {
    setRunDateFilter(value);
  };



  const changeMonitoringType = (value: string) => {
    setMonitoringType(value);
  };

  // If monitoring type is 'Title Monitoring', render the TitleMonitoringDashboard
  if (monitoringType === 'Title Monitoring') {
    return <TitleMonitoringDashboard />;
  }

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      sorter: (a: any, b: any) => a.employee_name.localeCompare(b.employee_name),
      width: 180,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) => {
        const icon = platform === 'LinkedIn' ? <LinkedinOutlined /> :
                    platform === 'Twitter' ? <TwitterOutlined /> :
                    <FacebookOutlined />;
        return (
          <span>
            {icon} {platform || 'LinkedIn'}
          </span>
        );
      },
      filters: [
        { text: 'LinkedIn', value: 'LinkedIn' },
        { text: 'Twitter', value: 'Twitter' },
        { text: 'Facebook', value: 'Facebook' },
      ],
      onFilter: (value: any, record: any) => record.platform === value,
      width: 120,
    },
    {
      title: 'Findings',
      dataIndex: 'findings',
      key: 'findings',
      width: 300,
      render: (_: string, record: any) => (
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong>LinkedIn URL:</strong>
          </div>
          <div style={{ marginBottom: '6px', color: '#1890ff', wordBreak: 'break-all',cursor:'pointer' }}>
            <a href={record.linkedin_url} target="_blank" rel="noopener noreferrer">
              {record.linkedin_url || 'N/A'}
            </a>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Trigger Phrase:</strong>
          </div>
          <div style={{ marginBottom: '6px' }}>
            {record.trigger_phrase || 'No violations found'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>Category:</strong>
          </div>
          <div>
            {record.category_name || 'No Restricted Post Found'}
          </div>
        </div>
      ),
    },
    {
      title: 'Key Words Found',
      dataIndex: 'keywords_hit',
      key: 'keywords_hit',
      render: (keywordsHit: string) => {
        if (!keywordsHit || keywordsHit === '[]') return <span style={{ color: '#999' }}>None</span>;
        try {
          const keywords = JSON.parse(keywordsHit);
          return keywords.map((keyword: string, index: number) => (
            <Tag key={index} color="blue" style={{ marginBottom: '2px' }}>{keyword}</Tag>
          ));
        } catch {
          return <span style={{ color: '#999' }}>Invalid format</span>;
        }
      },
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (category: string) => {
        if (!category || category === 'No posts available') {
          return <span style={{ color: '#999' }}>No posts available</span>;
        }
        const color = category.includes('Violation') || category.includes('Advice') ? 'red' : 
                     category.includes('No Restricted') ? 'green' : 'orange';
        return <Tag color={color}>{category}</Tag>;
      },
      filters: [
        { text: 'Advertising Any Service', value: 'Advertising Any Service' },
        { text: 'Giving Investment Advice', value: 'Giving Investment Advice' },
        { text: 'No Restricted Post Found', value: 'No Restricted Post Found' },
        { text: 'No posts available', value: 'No posts available' },
      ],
      onFilter: (value: any, record: any) => record.category_name === value,
      width: 180,
    },
    {
      title: 'Bias',
      dataIndex: 'violation',
      key: 'violation',
      render: (violation: string) => {
        if (!violation) return <Badge color="default" text="Unknown" />;
        const color = violation === 'Yes' ? 'red' : 
                     violation === 'No' ? 'green' : 
                     'orange';
        const text = violation === 'Yes' ? 'Violation Found' :
                    violation === 'No' ? 'No Violation' :
                    violation === 'No posts available' ? 'No Posts' :
                    violation;
        return <Badge color={color} text={text} />;
      },
      filters: [
        { text: 'Violation Found', value: 'Yes' },
        { text: 'No Violation', value: 'No' },
        { text: 'No Posts', value: 'No posts available' },
      ],
      onFilter: (value: any, record: any) => record.violation === value,
      width: 140,
    }
  ];



  return (
    <div className="social-media-dashboard" style={{ padding: '24px' }}>
      <Spin spinning={loading}>
      {/* Header Section */}
      <Row gutter={[16, 16]} style={{ 
        marginBottom: 24, 
        width: '100%',
        maxWidth: '100%',
        marginLeft: 0,
        marginRight: 0,
        alignItems: 'center'
      }}>
        <Col span={8}>
          <Select
            value={runDateFilter}
            style={{ width: '100%' }}
            onChange={handleRunDateChange}
            loading={loading}
            placeholder="Filter by run date"
          >
            {runDates.map(date => (
              <Option key={date.value} value={date.value}>
                {date.label === 'All Runs' ? 'All Runs' : `Run Date: ${date.label}`}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={10}>
          <Input
            placeholder="Search by employee name"
            allowClear
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: '100%' }}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={6} style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={handleFreshRun}
            loading={loading}
            style={{ width: '100%' }}
          >
            Execute fresh run
          </Button>
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

        {/* Selected Document Info */}
        {selectedDocument && (
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Title level={4} style={{ color: '#1890ff', margin: 0 }}>
                  Selected Run Details
                </Title>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Run ID:</strong>
                <br />
                <span style={{ fontSize: '0.9rem' }}>
                  {selectedDocument.run_id.substring(0, 8)}...
                </span>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Period:</strong>
                <br />
                <span style={{ fontSize: '0.9rem' }}>{formatPeriod(selectedDocument.period)}</span>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Duration:</strong>
                <br />
                <span style={{ fontSize: '0.9rem' }}>{Math.floor(selectedDocument.duration / 60)} min {Math.floor(selectedDocument.duration % 60)} sec</span>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <strong>Created:</strong>
                <br />
                <span style={{ fontSize: '0.9rem' }}>{dayjs(selectedDocument.created_at).format('MMM D, YYYY HH:mm')}</span>
              </Col>
            </Row>
          </Card>
        )}

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
                        {selectedDocument ? `${Math.floor(selectedDocument.duration / 60)} min ${Math.floor(selectedDocument.duration % 60)} sec` : '19 min 58 sec'}
                      </div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '180px', padding: '0 8px' }}>
                    <Card title="Period Considered" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        {selectedDocument ? formatPeriod(selectedDocument.period) : 'Jul 29, 2025 - Aug 4, 2025'}
                      </div>
                    </Card>
                  </Col>
                  <Col flex="1" style={{ minWidth: '140px', padding: '0 8px' }}>
                    <Card title="Employees Analyzed" size="small" style={{ height: '100%', margin: 0 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {socialMediaData.length}
                      </div>
                    </Card>
                  </Col>
                </Row>

        {/* Dropdown Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Monitoring Type</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="Post Monitoring"
                onChange={(value) => {
                  changeMonitoringType(value);
                  }}
              >
                <Option value="Post Monitoring">Post Monitoring</Option>
                <Option value="Title Monitoring">Title Monitoring</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Key Words Found</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select keywords..."
                onChange={(value) => {
                  setKeywordsFilter(value.length > 0 ? value.join(',') : 'All');
                }}
              >
                <Option value="Financial">Financial</Option>
                <Option value="Political">Political</Option>
                <Option value="Portfolio">Portfolio</Option>
                <Option value="Retirement">Retirement</Option>
                <Option value="Tax">Tax</Option>
                <Option value="Fee">Fee</Option>
                <Option value="Return">Return</Option>
                <Option value="Diversification">Diversification</Option>
                <Option value="Securities">Securities</Option>
                <Option value="Market">Market</Option>
                <Option value="Asset">Asset</Option>
                <Option value="Bonds">Bonds</Option>
                <Option value="Stock">Stock</Option>
                <Option value="Regulation">Regulation</Option>
                <Option value="Compliance">Compliance</Option>
                <Option value="Advice">Advice</Option>
                <Option value="Guarantee">Guarantee</Option>
                <Option value="Performance">Performance</Option>
                <Option value="Financial Planning">Financial Planning</Option>
                <Option value="Fiduciary">Fiduciary</Option>
                <Option value="Elite">Elite</Option>
                <Option value="Perfect">Perfect</Option>
                <Option value="Best">Best</Option>
                <Option value="Free">Free</Option>
                <Option value="No risk">No risk</Option>
                <Option value="Insider information">Insider information</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="filter-group">
              <label>Bias</label>
              <Select
                style={{ width: '100%' }}
                defaultValue="all"
                onChange={(value) => console.log('Bias:', value)}
              >
                <Option value="all">All</Option>
                <Option value="high">Detected</Option>
                <Option value="low">Not Detected</Option>
              </Select>
            </div>
          </Col>
          
        </Row>

        {/* Main Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record, index) => record.employee_name || `row-${index}`}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
            scroll={{ x: 800 }}
            size="small"
            loading={loading}
            locale={{
              emptyText: (
                <div style={{ padding: '40px 0' }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No social media findings match your search criteria"
                  />
                </div>
              ),
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default SocialMediaMonitoringDashboard;
