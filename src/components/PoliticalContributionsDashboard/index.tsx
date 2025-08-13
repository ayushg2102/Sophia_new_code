import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Row, 
  Col, 
  Typography,
  Card, 
  Select, 
  Input, 
  Button, 
  Table, 
  Spin,
  message,
} from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Header from '../Header/Header';
const { Text } = Typography;
const { Option } = Select;

interface Contribution {
  key: string;
  employeeName: string;
  employeeId: string;
  latestContribution: number;
  latestContributionDate: string;
  ytdContribution: number;
  status: 'Red' | 'Amber' | 'Green';
  runDate: string;
  documentId: string;
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

// API endpoint for political contributions
const API_ENDPOINT = 'https://sophia.xponance.com/api/collection/political-contributions';

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
const transformContributionsFromDocument = (doc: DocumentData): Contribution[] => {
  if (!doc || !Array.isArray(doc.output)) return [];
  
  const contributions: Contribution[] = [];
  
  doc.output.forEach((contribution: any, index: number) => {
    if (!contribution?.employee_name) return;
    
    const amount = Number(contribution.contribution_receipt_amount) || 0;
    const date = contribution.contribution_receipt_date || '';
    const employeeId = `${doc._id}_${contribution.employee_name}_${index}`;
    const employeeName = String(contribution.employee_name || 'Unknown');
    const ytdAmount = Number(contribution.contributor_aggregate_ytd) || 0;
    const flag = contribution.Flag;
    
    // Determine status based on Flag or amount thresholds
    let status: 'Red' | 'Amber' | 'Green' = 'Green';
    if (flag === true || flag === 'Red' || amount > 2000) status = 'Red';
    else if (flag === 'Amber' || amount > 1000) status = 'Amber';
    
    contributions.push({
      key: employeeId,
      employeeName,
      employeeId,
      latestContribution: amount,
      latestContributionDate: date,
      ytdContribution: ytdAmount || amount,
      status,
      runDate: dayjs(doc.created_at).format('MMM D, YYYY'),
      documentId: doc._id
    });
  });
  
  return contributions;
};

// Function to fetch political contributions data from API
const fetchPoliticalContributions = async (): Promise<DocumentData[]> => {
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
    console.error('Error fetching political contributions:', error);
    throw error;
  }
};

const PoliticalContributionsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [runDateFilter, setRunDateFilter] = useState<string>('All');
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [runDates, setRunDates] = useState<{label: string, value: string}[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  
  // Load and transform data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const documents = await fetchPoliticalContributions();
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
          const lastDocContributions = transformContributionsFromDocument(lastDocument);
          
          setContributions(lastDocContributions);
          setSelectedDocument(lastDocument);
          setRunDateFilter(lastDocument._id);
        } else {
          // Fallback: Load all contributions if no documents
          const allContributions: Contribution[] = [];
          documents.forEach(doc => {
            const docContributions = transformContributionsFromDocument(doc);
            allContributions.push(...docContributions);
          });
          
          setContributions(allContributions);
        }
        
        if (documents.length > 0) {
          const lastDocument = documents[documents.length - 1];
          const lastDocContributions = transformContributionsFromDocument(lastDocument);
          message.success(`Loaded ${documents.length} document runs, showing latest run with ${lastDocContributions.length} contribution records`);
        }
      } catch (error) {
        console.error('Error loading political contributions:', error);
        message.error('Failed to load political contributions data from API');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter data based on selected run date
  useEffect(() => {
    if (runDateFilter === 'All') {
      // Show all contributions from all documents
      const allContributions: Contribution[] = [];
      allDocuments.forEach(doc => {
        const docContributions = transformContributionsFromDocument(doc);
        allContributions.push(...docContributions);
      });
      setContributions(allContributions);
      setSelectedDocument(null);
    } else {
      // Show contributions from selected document only
      const selectedDoc = allDocuments.find(doc => doc._id === runDateFilter);
      if (selectedDoc) {
        const docContributions = transformContributionsFromDocument(selectedDoc);
        setContributions(docContributions);
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

  const filteredData = useMemo(() => {
    const filtered = contributions.filter(item => {
      const matchesSearch = item.employeeName.toLowerCase().includes(debouncedSearchText.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
      
      return matchesSearch && matchesStatus;
    });
    
    // Sort by YTD contribution amount in descending order (highest first)
    return filtered.sort((a, b) => b.ytdContribution - a.ytdContribution);
  }, [contributions, debouncedSearchText, statusFilter]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: Contribution, b: Contribution) => a.employeeName.localeCompare(b.employeeName),
      width: '35%',
      ellipsis: true
    },
    {
      title: 'Latest Contribution',
      dataIndex: 'latestContribution',
      key: 'latestContribution',
      sorter: (a: Contribution, b: Contribution) => a.latestContribution - b.latestContribution,
      width: '20%',
      align: 'right' as const,
      render: (amount: number) => amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }),
    },
    {
      title: 'Contribution Date',
      dataIndex: 'latestContributionDate',
      key: 'latestContributionDate',
      sorter: (a: Contribution, b: Contribution) => 
        new Date(a.latestContributionDate).getTime() - new Date(b.latestContributionDate).getTime(),
      width: '20%',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : 'N/A',
    },
    {
      title: 'YTD Contribution',
      dataIndex: 'ytdContribution',
      key: 'ytdContribution',
      sorter: (a: Contribution, b: Contribution) => a.ytdContribution - b.ytdContribution,
      width: '20%',
      align: 'right' as const,
      render: (amount: number, record: Contribution) => {
        const formattedAmount = amount.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        });
        
        // Determine color based on status
        let color = '#52c41a'; // Green (default)
        if (record.status === 'Red') {
          color = '#ff4d4f'; // Red
        } else if (record.status === 'Amber') {
          color = '#faad14'; // Orange/Amber
        }
        
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {formattedAmount}
          </span>
        );
      },
    },
  ];

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleStatusChange = (value: string[]) => {
    // If 'All' is selected, clear other selections and show all data
    if (value.includes('All')) {
      setStatusFilter([]);
    } else {
      setStatusFilter(value);
    }
  };

  const handleRunDateChange = (value: string) => {
    setRunDateFilter(value);
  };
  const handleFileDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/Files/political_contributions_20250804_155626.xlsx';
    link.download = 'political_contributions_20250804_155626.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFreshRun = async () => {
    try {
      setLoading(true);
      const documents = await fetchPoliticalContributions();
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
        const lastDocContributions = transformContributionsFromDocument(lastDocument);
        
        setContributions(lastDocContributions);
        setSelectedDocument(lastDocument);
        setRunDateFilter(lastDocument._id);
      } else {
        // Reset to show all data if no documents
        setRunDateFilter('All');
      }
      
      message.success('Political contributions data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing political contributions:', error);
      message.error('Failed to refresh political contributions data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    console.log('contributions', contributions);
    const totalEmployees = contributions.length;
    const totalContributions = contributions.reduce((sum, curr) => sum + curr.ytdContribution, 0);
    const redAlerts = contributions.filter(c => c.status === 'Red').length;
    const amberAlerts = contributions.filter(c => c.status === 'Amber').length;
    const greenAlerts = contributions.filter(c => c.status === 'Green').length;
    
    // Use selected document data if available, otherwise use aggregated data
    let latestRun = 'No data';
    let periodConsidered = 'N/A';
    let startedAt = '';
    let completedAt = '';
    let duration = 'N/A';
    
    if (selectedDocument) {
      // Use data from the selected document
      latestRun = dayjs(selectedDocument.created_at).format('MMM D, YYYY');
      periodConsidered = formatPeriod(selectedDocument.period);
      startedAt = dayjs(selectedDocument.created_at).format('MM/DD/YYYY, hh:mm A');
      completedAt = dayjs(selectedDocument.updated_at).format('MM/DD/YYYY, hh:mm A');
      
      // Format duration from seconds to readable format
      const durationSeconds = selectedDocument.duration;
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = Math.floor(durationSeconds % 60);
      duration = `${minutes} min ${seconds} sec`;
    } else if (contributions.length > 0) {
      // Fallback to aggregated data when showing all runs
      latestRun = 'Multiple runs';
      periodConsidered = 'All periods';
      const now = new Date();
      startedAt = now.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      completedAt = now.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      duration = 'Aggregated';
    }
    
    return {
      totalEmployees,
      totalContributions,
      redAlerts,
      amberAlerts,
      greenAlerts,
      latestRun,
      periodConsidered,
      startedAt,
      completedAt,
      duration,
      contributionCategory: ['Green', 'Amber', 'Red'] // Default category
    };
  }, [contributions, selectedDocument]);

  return (
    <>
    <Header />
    <div style={{ 
      width: '100%', 
      maxWidth: '100%',
      padding: '0 24px',
      marginTop: 24,
      boxSizing: 'border-box'
    }}>
      <Spin spinning={loading}>
        {/* Selected Document Info */}
        {/* {selectedDocument && (
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  Selected Run Details
                </Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Run ID:</Text>
                <br />
                <Text copyable={{ text: selectedDocument.run_id }}>
                  {selectedDocument.run_id.substring(0, 8)}...
                </Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Period:</Text>
                <br />
                <Text>{selectedDocument.period}</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Duration:</Text>
                <br />
                <Text>{Math.floor(selectedDocument.duration / 60)} min {Math.floor(selectedDocument.duration % 60)} sec</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Created:</Text>
                <br />
                <Text>{dayjs(selectedDocument.created_at).format('MMM D, YYYY HH:mm')}</Text>
              </Col>
            </Row>
          </Card>
        )} */}

        {/* Header Section */}
        <Row gutter={[16, 16]} style={{ 
          marginBottom: 24, 
          width: '100%',
          maxWidth: '100%',
          marginLeft: 0,
          marginRight: 0,
          alignItems: 'center'
        }}>
          <Col span={10}>
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
          <Col span={7}>
            <Input
              placeholder="Search by employee name"
              allowClear
              value={searchText}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={5} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={handleFreshRun}
              loading={loading}
              style={{ width: '100%',marginLeft: '105px' }}
            >
              Execute fresh run
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleFileDownload}
              loading={loading}
              style={{ width: '100%', marginLeft: '16px' }}
            >
              Download File
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ 
          marginBottom: 24, 
          width: '100%',
          maxWidth: '100%',
          marginLeft: 0,
          marginRight: 0
        }}>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Started At</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.startedAt}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Completed At</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.completedAt}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Duration</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.duration}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Period Considered</Text>
                <Text strong style={{ marginTop: 4, fontSize: '0.9rem' }}>
                  {summaryStats.periodConsidered}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Employees Analyzed</Text>
                <Text strong style={{ marginTop: 4, fontSize: '1.1rem' }}>
                  {summaryStats.totalEmployees}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text type="secondary">Contribution Category</Text>
                <Select 
                  mode="multiple"
                  value={statusFilter}
                  style={{ width: '100%', marginTop: 4 }}
                  onChange={handleStatusChange}
                  placeholder={statusFilter.length === 0 ? "All Categories" : "Select status"}
                  allowClear
                  maxTagCount="responsive"
                >
                  <Option value="Green">Green</Option>
                  <Option value="Amber">Amber</Option>
                  <Option value="Red">Red</Option>
                </Select>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Table Section */}
        <div style={{ 
          width: '100%', 
          maxWidth: '100%',
          overflowX: 'auto',
          margin: 0,
          padding: 0
        }}>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            loading={loading}
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
            scroll={{ x: 'max-content' }}
            style={{ width: '100%' }}
            bordered
            locale={{
              emptyText:
                searchText || statusFilter.length > 0 || runDateFilter !== 'All'
                  ? 'No matching records found'
                  : 'No data available',
            }}
            className="contributions-table"
          />
        </div>
      </Spin>
    </div>
    </>
  );
};

export default PoliticalContributionsDashboard;
