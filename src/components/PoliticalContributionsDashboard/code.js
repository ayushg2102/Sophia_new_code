import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Row, Col, Select, Button, Tag, Typography, Divider, Input, Table, Popover, Empty, Layout, Tooltip, List } from "antd";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import "./TaskDetailScreen.css";
import "./SharedStyles.css";
import { statusConfig } from './Task';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, SyncOutlined, AlertOutlined, RocketOutlined, InfoCircleOutlined, CaretRightOutlined, FileTextOutlined, DownloadOutlined, LogoutOutlined, SearchOutlined, LikeOutlined, DislikeOutlined, MessageOutlined, CopyOutlined } from "@ant-design/icons";
import { message } from 'antd';
import { API_CONFIG } from '../../constants/api';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from "../config";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./Header";
import complianceCalendarManagementData from '../mockData/complianceCalendarManagementData';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;
const { Content } = Layout;

// Utility: Convert instructions string to HTML unordered list
function instructionsToHtml(instructions) {
  if (!instructions || typeof instructions !== 'string') return '';
  // Split by sections (GOAL, STEPS, WHAT SHOULD..., SUCCESS CRITERIA)
  const sectionRegex = /(GOAL|STEPS|WHAT SHOULD [^\n]+|SUCCESS CRITERIA)/g;
  const parts = instructions.split(sectionRegex).filter(Boolean);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (sectionRegex.test(parts[i])) {
      html += `<strong>${parts[i]}</strong>`;
      // Next part is the content
      if (i + 1 < parts.length) {
        let content = parts[i + 1].trim();
        if (parts[i] === 'STEPS') {
          // Split by Step X:
          const steps = content.split(/Step \d+:/g).filter(Boolean);
          html += '<ul>';
          steps.forEach(step => {
            html += `<li>${step.trim().replace(/\n/g, '<br/>')}</li>`;
          });
          html += '</ul>';
        } else if (parts[i].startsWith('WHAT SHOULD') || parts[i] === 'SUCCESS CRITERIA') {
          // Split by newlines or arrows/bullets
          const items = content.split(/\n|\u2192|\u2022|\*/g).map(i => i.trim()).filter(Boolean);
          html += '<ul>';
          items.forEach(item => {
            html += `<li>${item}</li>`;
          });
          html += '</ul>';
        } else {
          html += `<p>${content.replace(/\n/g, '<br/>')}</p>`;
        }
        i++; // Skip content part
      }
    }
  }
  return html;
}

const TaskRunDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { task } = location.state || {}; // Get task from location.state, default to empty object

  console.log('TaskRunDetails component rendered.', { task });
  const [selectedRunId, setSelectedRunId] = useState(null); // State for selected run ID
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [politicalContributionFilter, setPoliticalContributionFilter] = useState(['all']);
  const [biasFilter, setBiasFilter] = useState(['all']); // Keep state for bias filter
  const [politicalContributionsData, setPoliticalContributionsData] = useState([]); // Raw political contributions data for filtering
  const [runOptions, setRunOptions] = useState([]); // State for run dropdown options
  const [allPoliticalContributionsData, setAllPoliticalContributionsData] = useState([]); // Store all fetched data for a collection
  const hasFetchedCollection = useRef({}); // Use ref to track fetched status for each collection
  const [politicalContributionEmployees, setPoliticalContributionEmployees] = useState([]); // Filtered data for political contributions table
  const [socialMediaAnalysisData, setSocialMediaAnalysisData] = useState([]);
  const [socialMediaRawData, setSocialMediaRawData] = useState([]); // New state for raw social media data
  const [contributionCategoryFilter, setContributionCategoryFilter] = useState(['all']); // State for contribution category filter
  const [keywordsFilter, setKeywordsFilter] = useState(['all']); // New state for keywords filter
  const [executingRun, setExecutingRun] = useState({}); // { [collection_name]: true/false }
  const [freshRunButtonText, setFreshRunButtonText] = useState({}); // { [collection_name]: 'Executing' | 'Execute fresh run' }
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [pageSize, setPageSize] = useState(10); // New state for page size
  const [username, setUsername] = useState('Admin'); // Placeholder for username
  const [keywordsOptions, setKeywordsOptions] = useState([]); // New state for keywords options
  const [monitoringType, setMonitoringType] = useState('keyword'); // New state for monitoring type
  const [titleCategoryFilter, setTitleCategoryFilter] = useState(['all']); // New state for Title Category filter
  const [feedbackState, setFeedbackState] = useState({}); // { [rowKey]: { like: boolean, dislike: boolean, comment: string, commentInput: string } }
  const [calendarLogs, setCalendarLogs] = useState([]);
  const [calendarTableStatus, setCalendarTableStatus] = useState([]); // Will be set from API
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef(null);
  const [calendarTableData, setCalendarTableData] = useState(complianceCalendarManagementData); // Dynamic table data
  const [showFullInstructions, setShowFullInstructions] = useState(false); // New state for instructions visibility
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(''); // New dropdown state

  const isInstructionsTask = task?.instructions || (typeof task?.instructions === 'string' && /\d+\./.test(task.instructions));
  // console.log(Array.isArray(task?.instructions),"IMPORTSANT");
  
  // Helper: Parse log lines to update status
  const updateTableStatusFromLogs = useCallback((logs, tableData) => {
    // Copy tableData to avoid mutation
    const updated = tableData.map(row => ({ ...row }));
    logs.forEach(line => {
      // Try to match "Task X completed successfully" and update status
      const match = line.match(/Task (\d+) completed successfully/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (updated[idx]) updated[idx].status = "Completed";
      }
    });
    return updated;
  }, []);

  // Handler for Execute fresh run (Compliance Calendar Management)
  const handleCalendarFreshRun = async () => {
    setIsPolling(true);
    setCalendarLogs([]);
    setCalendarTableStatus([]);
    setCalendarTableData(complianceCalendarManagementData);
    if (task && task._id) {
      console.log('Execute fresh run for task _id:', task._id);
    }
    try {
      const response = await fetch('https://sophia.xponance.com/api/calendar-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: task && task._id ? task._id : undefined
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        startPollingLogs();
      } else {
        message.error('Failed to start calendar invites agent');
        setIsPolling(false);
      }
    } catch (err) {
      message.error('Network error');
      setIsPolling(false);
    }
  };

  // Polling function for real-time logs and table data
  const startPollingLogs = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch('https://sophia.xponance.com/api/logs/calendar-invites');
        const data = await res.json();
        if (data.status === 'success') {
          // Logs
          const logs = data.data.logs?.calendar_send_invites_log || [];
          setCalendarLogs(logs);
          // Table data: try to extract from logs or use available API data
          // For demo, we use static structure if not present
          let tableData = calendarTableData.length > 0 ? calendarTableData : complianceCalendarManagementData;
          // If API provides table data, use it here instead
          // Update status from logs
          const updatedTable = updateTableStatusFromLogs(logs, tableData);
          setCalendarTableData(updatedTable);
          setCalendarTableStatus(updatedTable.map(row => ({ key: row.key, status: row.status })));
          // Stop polling if all completed
          if (updatedTable.every(row => row.status === 'Completed')) {
            clearInterval(pollingRef.current);
            setIsPolling(false);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }, 2000);
  }, [calendarTableData, updateTableStatusFromLogs]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Define a generic fetch function for run options (all documents for a collection)
  const fetchRunOptions = async (currentTask) => {
    if (currentTask && currentTask.collection_name) {
      const collectionKey = currentTask.collection_name;

      // Only fetch if not already fetched for this collection during current session
      if (hasFetchedCollection.current[collectionKey]) return;
      hasFetchedCollection.current[collectionKey] = true;

      try {
        setLoading(true); // Set loading true when starting to fetch options
        const apiUrl = API_CONFIG.ENDPOINTS.COLLECTION_BY_NAME(currentTask.collection_name);
        console.log(`Fetching run options from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json(); // Renamed to apiData to avoid conflict with 'data' prop
        console.log("Fetched run options data:", apiData);

        if (apiData.status === "success" && Array.isArray(apiData.data.documents)) {
          setAllPoliticalContributionsData(apiData.data.documents); // Store all documents
          
          const extractedRunOptions = apiData.data.documents.map(doc => {
            let periodLabel = '';
            if (doc.period && doc.period !== 'N/A') {
              const [startDateStr, endDateStr] = doc.period.split(' to ');
              const startDate = dayjs(startDateStr);
              const endDate = dayjs(endDateStr);

              const formattedStartDate = startDate.isValid() ? startDate.format('MMM D, YYYY') : 'Invalid Date';
              const formattedEndDate = endDate.isValid() ? endDate.format('MMM D, YYYY') : 'Invalid Date';

              periodLabel = ` | Period Covered – ${formattedStartDate} to ${formattedEndDate}`;
            }

            return {
              label: `RunDate – ${dayjs.utc(doc.updated_at).tz('America/New_York').format('MMM D, YYYY')}${periodLabel}`,
              value: doc.updated_at,
              displayLabel: `Run @ ${dayjs.utc(doc.updated_at).tz('America/New_York').format('MM/DD/YYYY HH:mm')}`
            };
          }).sort((a, b) => new Date(b.value) - new Date(a.value)); // Chained sort

          setRunOptions(extractedRunOptions);

          // Set the first run as the default selected value ONLY IF none is currently selected
          if (extractedRunOptions.length > 0 && selectedRunId === null) {
            setSelectedRunId(extractedRunOptions[0].value);
          }
        } else {
           console.error("API response documents array is missing or has unexpected structure:", apiData);
           setAllPoliticalContributionsData([]);
           setRunOptions([]);
           setSelectedRunId(null);
        }
      } catch (error) {
        console.error("Error fetching run options:", error);
        setAllPoliticalContributionsData([]);
        setRunOptions([]);
        setSelectedRunId(null);
        message.error("Failed to fetch run options.");
      } finally {
        setLoading(false); // Set loading false after fetching options
      }
    } else {
       // Reset state when task changes or no collection_name
       hasFetchedCollection.current = {};
       setAllPoliticalContributionsData([]);
       setRunOptions([]);
       setSelectedRunId(null);
       setPoliticalContributionsData([]);
       setPoliticalContributionEmployees([]);
       setSocialMediaAnalysisData([]);
       setSocialMediaRawData([]);
    }
  };

  // Effect to fetch run options on mount or task change
  useEffect(() => {
    if (task) {
      fetchRunOptions(task);
    }
    // Always reset calendar table data to static when task changes (for Compliance Calendar Management)
    if (task && task.task_name === 'Compliance Calendar Management') {
      setCalendarTableData(complianceCalendarManagementData);
    }
  }, [task]); // Refetch run options when the task changes

  // New useEffect to fetch and process details for the selected run
  useEffect(() => {
    if (selectedRunId && allPoliticalContributionsData.length > 0) {
      const selectedRunData = allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId);

      if (selectedRunData && Array.isArray(selectedRunData.output)) {
        if (task && task.task_name === "Political Contributions - Alerts & Monitoring") {
          // Apply filtering and sorting for political contributions
          const filteredAndSorted = filterPoliticalContributions(selectedRunData.output).sort((a, b) => {
            const ytdA = parseFloat(a.contributor_aggregate_ytd || 0);
            const ytdB = parseFloat(b.contributor_aggregate_ytd || 0);

            let categoryA = 0;
            if (ytdA > 350) { categoryA = 1; } else if (ytdA > 0 && ytdA <= 350) { categoryA = 2; } else if (ytdA === 0) { categoryA = 3; }

            let categoryB = 0;
            if (ytdB > 350) { categoryB = 1; } else if (ytdB > 0 && ytdB <= 350) { categoryB = 2; } else if (ytdB === 0) { categoryB = 3; }

            return categoryA - categoryB;
          });
          setPoliticalContributionEmployees(filteredAndSorted);
          setPoliticalContributionsData(selectedRunData.output); // Store the raw data for filtering
        } else if (task && task.task_name === "Social Media - Alerts & Monitoring") {
          // Store raw social media data
          setSocialMediaRawData(selectedRunData.output);
          // Initial filter application
          setSocialMediaAnalysisData(filterSocialMediaAnalysis(selectedRunData.output));

          // Extract unique keywords for the filter dropdown
          // Commented out dynamic keyword extraction as a static list will be used
          // const allKeywords = new Set();
          // selectedRunData.output.forEach(item => {
          //   if (item.keywords_hit) {
          //     try {
          //       const parsedKeywords = JSON.parse(item.keywords_hit);
          //       if (Array.isArray(parsedKeywords)) {
          //         parsedKeywords.forEach(keyword => allKeywords.add(keyword));
          //       }
          //     } catch (e) {
          //       console.error("Error parsing keywords_hit for dropdown options:", item.keywords_hit, e);
          //     }
          //   }
          // });
          setKeywordsOptions([
            { label: 'All', value: 'all' },
            { label: 'Investment', value: 'Investment' },
            { label: 'Risk', value: 'Risk' },
            { label: 'Portfolio', value: 'Portfolio' },
            { label: 'Retirement', value: 'Retirement' },
            { label: 'Tax', value: 'Tax' },
            { label: 'Fee', value: 'Fee' },
            { label: 'Return', value: 'Return' },
            { label: 'Diversification', value: 'Diversification' },
            { label: 'Securities', value: 'Securities' },
            { label: 'Market', value: 'Market' },
            { label: 'Asset', value: 'Asset' },
            { label: 'Bonds', value: 'Bonds' },
            { label: 'Stock', value: 'Stock' },
            { label: 'Regulation', value: 'Regulation' },
            { label: 'Compliance', value: 'Compliance' },
            { label: 'Advice', value: 'Advice' },
            { label: 'Guarantee', value: 'Guarantee' },
            { label: 'Performance', value: 'Performance' },
            { label: 'Financial Planning', value: 'Financial Planning' },
            { label: 'Fiduciary', value: 'Fiduciary' },
            { label: 'Elite', value: 'Elite' },
            { label: 'Perfect', value: 'Perfect' },
            { label: 'Best', value: 'Best' },
            { label: 'Free', value: 'Free' },
            { label: 'No risk', value: 'No risk' },
            { label: 'Insider information', value: 'Insider information' }
          ]);
        }
      } else {
        setPoliticalContributionEmployees([]);
        setSocialMediaAnalysisData([]);
        setPoliticalContributionsData([]); // Clear raw data when no valid data
        setSocialMediaRawData([]); // Clear raw social media data as well
      }
    } else {
      setPoliticalContributionEmployees([]);
      setSocialMediaAnalysisData([]);
      setPoliticalContributionsData([]); // Clear raw data when no run selected
      setSocialMediaRawData([]); // Clear raw social media data
    }
  }, [selectedRunId, allPoliticalContributionsData, task]);

  // Effect to handle filtering when filters change
  useEffect(() => {
    if (politicalContributionsData.length > 0 && task && task.task_name === "Political Contributions - Alerts & Monitoring") {
      const filteredAndSorted = filterPoliticalContributions(politicalContributionsData).sort((a, b) => {
        const ytdA = parseFloat(a.contributor_aggregate_ytd || 0);
        const ytdB = parseFloat(b.contributor_aggregate_ytd || 0);

        let categoryA = 0;
        if (ytdA > 350) { categoryA = 1; } else if (ytdA > 0 && ytdA <= 350) { categoryA = 2; } else if (ytdA === 0) { categoryA = 3; }

        let categoryB = 0;
        if (ytdB > 350) { categoryB = 1; } else if (ytdB > 0 && ytdB <= 350) { categoryB = 2; } else if (ytdB === 0) { categoryB = 3; }

        return categoryA - categoryB;
      });
      setPoliticalContributionEmployees(filteredAndSorted);
    }
  }, [employeeSearch, politicalContributionFilter, biasFilter, contributionCategoryFilter, politicalContributionsData, task]);

  // Effect to handle social media filtering when filters change
  useEffect(() => {
    if (socialMediaRawData.length > 0 && task && task.task_name === "Social Media - Alerts & Monitoring") {
      setSocialMediaAnalysisData(filterSocialMediaAnalysis(socialMediaRawData));
    }
  }, [employeeSearch, biasFilter, keywordsFilter, socialMediaRawData, task]);

  // Effect to handle title category filtering when filters change (for Title Monitoring)
  useEffect(() => {
    if (socialMediaRawData.length > 0 && task && task.task_name === "Social Media - Alerts & Monitoring" && monitoringType === 'title') {
      setSocialMediaAnalysisData(filterSocialMediaAnalysis(socialMediaRawData));
    }
  }, [employeeSearch, biasFilter, keywordsFilter, titleCategoryFilter, socialMediaRawData, task, monitoringType]);

  // Helper to get cooldown duration
  function getFreshRunCooldown(task) {
    if (task && task.task_name === "Social Media - Alerts & Monitoring") {
      return 2 * 60 * 1000; // 2 minutes in ms
    }
    // Default to 10 minutes for Political Contributions and others
    return 10 * 60 * 1000;
  }

  // Effect to check local storage and manage timer on mount/task change
  useEffect(() => {
    if (!task || !task.collection_name) return;
    const storedTimestamp = localStorage.getItem('freshRunClickTimestamp_' + task.collection_name);
    if (storedTimestamp) {
      const clickTime = parseInt(storedTimestamp, 10);
      const currentTime = Date.now();
      const elapsed = currentTime - clickTime;
      const cooldown = getFreshRunCooldown(task);

      if (elapsed < cooldown) {
        const remainingTime = cooldown - elapsed;
        setExecutingRun(prev => ({ ...prev, [task.collection_name]: true }));
        setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Executing' }));

        const timer = setTimeout(() => {
          setExecutingRun(prev => ({ ...prev, [task.collection_name]: false }));
          setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Execute fresh run' }));
          localStorage.removeItem('freshRunClickTimestamp_' + task.collection_name);
          fetchRunOptions(task);
          message.success('Fresh run execution completed. Data refreshed.');
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        localStorage.removeItem('freshRunClickTimestamp_' + task.collection_name);
        setExecutingRun(prev => ({ ...prev, [task.collection_name]: false }));
        setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Execute fresh run' }));
      }
    } else {
      setExecutingRun(prev => ({ ...prev, [task.collection_name]: false }));
      setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Execute fresh run' }));
    }
    return () => {};
  }, [task]);

  // Map raw API status to the exact keys in statusConfig
  const getEffectiveStatusKey = (rawStatus) => {
    if (!rawStatus) return 'Unknown Status';

    const lowerCaseStatus = rawStatus.toLowerCase();

    // Direct mappings for common API statuses to statusConfig keys
    if (lowerCaseStatus === 'completed') return 'Completed';
    if (lowerCaseStatus === 'active') return 'Active';
    if (lowerCaseStatus.includes('not due') || lowerCaseStatus.includes('not_due')) return 'Not due';
    if (lowerCaseStatus.includes('no follow-up') || lowerCaseStatus.includes('no_follow-up')) return 'no follow-up yet';
    if (lowerCaseStatus.includes('follow-up initiated') || lowerCaseStatus.includes('follow_up_initiated')) return 'Follow-up Initiated';
    if (lowerCaseStatus.includes('delayed') || lowerCaseStatus.includes('failed')) return 'Delayed';
    if (lowerCaseStatus.includes('under training') || lowerCaseStatus.includes('under_training')) return 'Under training';

    // Fallback if no direct match. This might still be a source of mismatch if API sends other variations.
    return rawStatus.replace(/_/g, ' ').replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  };

  const effectiveStatusKey = getEffectiveStatusKey(task?.status);
  console.log('Task Status (raw):', task?.status);
  console.log('Effective Status Key:', effectiveStatusKey);

  const statusInfo = statusConfig[effectiveStatusKey] || {
    icon: <ExclamationCircleOutlined />,
    color: "#f5f5f5",
    textColor: "#595959",
    label: effectiveStatusKey
  };

  // Define options for the Contribution Category filter
  const contributionCategoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Green - 0 USD YTD', value: 'green' },
    { label: 'Amber - 1 - 350 USD YTD', value: 'amber' },
    { label: 'Red >350 USD YTD', value: 'red' },
  ];

  const biasOptions = [
    { label: 'All', value: 'all' },
    { label: 'Detected', value: 'Detected' },
    { label: 'Not Detected', value: 'Not Detected' },
  ];

  const filterSocialMediaAnalysis = (employees) => {
    if (!employees || !Array.isArray(employees)) {
      return [];
    }

    let processedData = employees.map(employee => ({
      key: employee.employee_id || employee.employee_name, // Unique key for Ant Design table
      employee_name: employee.employee_name,
      violation: employee.violation, // Directly include violation status
      linkedin_url: employee.linkedin_url, // Directly include linkedin_url
      keywords_hit: employee.keywords_hit, // Directly include keywords_hit
      trigger_phrase: employee.trigger_phrase, // Directly include trigger_phrase
      tittle_matching_details: employee.tittle_matching_details, // Include tittle_matching_details
      posted_at: employee.posted_at, // Include posted_at
      category_name: employee.category_name, // Include category_name
      // Add these fields for Title Monitoring
      "Title as per HR": employee["Title as per HR"],
      "Title as per LinkedIn": employee["Title as per LinkedIn"],
      "Title Category": employee["Title Category"],
      // Ensure Keywords Category is always mapped
      "Keywords Category": employee["Keywords Category"],
    }));

    // Apply employee name search filter
    const searchedEmployees = employeeSearch.trim() === ''
      ? processedData
      : processedData.filter(item =>
          item.employee_name.toLowerCase().includes(employeeSearch.toLowerCase())
        );

    let filteredByBias = [];
    // Apply bias status filter (now based on 'violation' field)
    if (biasFilter.includes('all')) {
      filteredByBias = searchedEmployees;
    } else {
      filteredByBias = searchedEmployees.filter(item => {
        const itemBiasStatus = item.violation === "Yes" ? 'Detected' : item.violation === "No" ? 'Not Detected' : 'N/A';
        return biasFilter.some(filter => {
          if (filter === 'Detected') {
            return itemBiasStatus === 'Detected';
          } else if (filter === 'Not Detected') {
            return itemBiasStatus === 'Not Detected';
          }
          return false;
        });
      });
    }

    // Title Monitoring: filter by Title Category
    if (monitoringType === 'title') {
      let filtered = filteredByBias;
      if (!(titleCategoryFilter.length === 1 && titleCategoryFilter[0] === 'all')) {
        filtered = filtered.filter(item => {
          if (!item['Title Category']) return false;
          if (titleCategoryFilter.includes('Title Matching') && item['Title Category'] === 'Title Matching') return true;
          if (titleCategoryFilter.includes('Title Not Matching') && item['Title Category'] !== 'Title Matching') return true;
          return false;
        });
      }
      return filtered;
    }

    // Apply keywords filter (for keyword monitoring)
    if (keywordsFilter.includes('all')) {
      return filteredByBias; // Show all employees after bias filtering
    }
    return filteredByBias.filter(item => {
      try {
        const parsedKeywords = JSON.parse(item.keywords_hit);
        return keywordsFilter.some(filter => parsedKeywords.includes(filter));
      } catch (e) {
        return false;
      }
    });
  };

  const filterPoliticalContributions = (employees) => {
    // If employees data is not available, return empty array
    if (!employees || !Array.isArray(employees)) {
      return [];
    }

    // Apply employee name search filter
    const searchedEmployees = employeeSearch.trim() === ''
      ? employees
      : employees.filter(employee =>
          employee.employee_name.toLowerCase().includes(employeeSearch.toLowerCase())
        );

    // Apply contribution category filter logic
    if (contributionCategoryFilter.length === 1 && contributionCategoryFilter[0] === 'all') {
        return searchedEmployees;
    }

    const filteredByCategory = searchedEmployees.filter(employee => {
        const ytdValue = parseFloat(employee.contributor_aggregate_ytd);
        return contributionCategoryFilter.some(filter => {
            if (filter === 'green') {
                return ytdValue === 0;
            } else if (filter === 'amber') {
                return ytdValue > 0 && ytdValue <= 350;
            } else if (filter === 'red') {
                return ytdValue > 350;
            }
            return false;
        });
    });

    return filteredByCategory;
  };

  // Helper to format duration
  function formatDuration(duration) {
    if (duration >= 60) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.round(duration % 60);
      return `${minutes} min ${seconds} sec`;
    }
    return `${duration.toFixed(2)} seconds`;
  }

  // Define columns for the Political Contributions Table
  const politicalTableColumns = [
    {
      title: 'Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      sorter: (a, b) => a.employee_name.localeCompare(b.employee_name),
    },
    {
      title: 'Latest contribution ($)',
      dataIndex: 'contribution_receipt_amount',
      key: 'contribution_receipt_amount',
      sorter: (a, b) => a.contribution_receipt_amount - b.contribution_receipt_amount,
    },
    {
      title: 'Latest contribution date',
      dataIndex: 'contribution_receipt_date',
      key: 'contribution_receipt_date',
      render: (text, record) => {
        if (!text || text === 'Thu, 01 Jan 1970 00:00:00 GMT') return 'N/A'; // Handle invalid or epoch dates
        try {
          const dateUTC = dayjs.utc(text); // Parse as UTC
          const dateEST = dateUTC.tz('America/New_York'); // Convert to EST
          return <Text>{dateEST.format('MM/DD/YYYY HH:mm')}</Text>;
        } catch (error) {
          console.error("Error parsing or formatting date:", text, error);
          return 'Invalid Date';
        }
      },
      // sorter removed as requested earlier
    },
    {
      title: (
        <Popover content="Year-to-date contribution">
          <span>YTD contribution ($)</span>
        </Popover>
      ),
      dataIndex: 'contributor_aggregate_ytd',
      key: 'contributor_aggregate_ytd',
      render: (text, record) => {
        const ytdValue = parseFloat(text);
        let color = 'black';
        if (ytdValue > 350) {
          color = 'red';
        } else if (ytdValue > 0 && ytdValue <= 350) {
          color = 'orange';
        } else if (ytdValue === 0) {
          color = 'green';
        }
        const rowKey = `${record.employee_id || record.employee_name}-ytd`;
        const feedback = feedbackState[rowKey] || {};
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color }}>{text}</span>
            <div className={`taskrun-feedback-inline${feedback.dislike ? ' with-comment' : ''}`}>
              <div className="taskrun-feedback-actions">
                <LikeOutlined
                  style={{ fontSize: 16, color: feedback.like ? '#1890ff' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'like')}
                />
                <DislikeOutlined
                  style={{ fontSize: 16, color: feedback.dislike ? '#ff4d4f' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'dislike')}
                />
              </div>
              <Input
                size="small"
                placeholder="Add comment"
                value={feedback.commentInput || ''}
                onChange={e => handleCommentInput(rowKey, e.target.value)}
                onPressEnter={() => handleCommentSubmit(rowKey)}
                className="taskrun-feedback-comment-input"
                prefix={<MessageOutlined />}
                style={{ width: '100%' }}
                maxLength={50}
              />
            </div>
            {feedback.dislike && feedback.comment && (
              <div className="taskrun-feedback-comment" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {feedback.comment}
                <Tooltip title="Comments left for thumbs down.">
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
      sorter: (a, b) => a.contributor_aggregate_ytd - b.contributor_aggregate_ytd,
    },
  ];

  // Define columns for the Social Media Analysis Tables
  const socialMediaTableColumns = [
    {
      title: 'Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      sorter: (a, b) => a.employee_name.localeCompare(b.employee_name),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: () => 'LinkedIn',
    },
    {
      title: 'Findings',
      dataIndex: 'findings',
      key: 'findings',
      width: '30%',
      minWidth: 250,
      render: (text, record) => {
        const findingsContent = [];
        if (record.linkedin_url) {
          findingsContent.push(<Text key="linkedin"><Text strong>LinkedIn URL:</Text> <a href={record.linkedin_url} target="_blank" rel="noopener noreferrer">{record.linkedin_url}</a></Text>);
        }
        if (record.trigger_phrase) {
          findingsContent.push(
            <div key="trigger" style={{ display: 'block', width: '100%' }}>
              <strong>Trigger Phrase:</strong> <Text style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}>{record.trigger_phrase}</Text>
            </div>
          );
        }
        if (record.posted_at && record.posted_at !== "No posted_at found") {
          findingsContent.push(<Text key="postedAt" style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}><Text strong>Posted At:</Text> {dayjs(record.posted_at).format('MM/DD/YYYY HH:mm')}</Text>);
        }
        if (record.category_name) {
          findingsContent.push(<Text key="categoryName" style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}><Text strong>Category:</Text> {record.category_name}</Text>);
        }
        return (
          <div className="taskrun-findings-column taskrun-findings-content-wrapper">
            {findingsContent.length > 0 ? findingsContent : <Text type="secondary">No findings.</Text>}
          </div>
        );
      },
    },
    {
      title: 'Key Words Found',
      dataIndex: 'keywords_hit',
      width: '20%',
      minWidth: 250,
      key: 'keywords_hit',
      render: (text) => {
        if (!text) return 'N/A';
        try {
          const parsedKeywords = JSON.parse(text);
          if (Array.isArray(parsedKeywords) && parsedKeywords.length > 0) {
            return parsedKeywords.join(', ');
          } else {
            return 'N/A';
          }
        } catch (e) {
          return 'N/A';
        }
      },
    },
    {
      title: 'Category',
      dataIndex: 'Keywords Category',
      key: 'keyword_matching',
      render: (text, record) => {
        const rowKey = `${record.key || record.employee_id || record.employee_name}-category`;
        const feedback = feedbackState[rowKey] || {};
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: typeof text === 'string' && text.trim().toLowerCase() === 'key word found' ? 'red' : 'green' }}>{text || 'N/A'}</span>
            <div className={`taskrun-feedback-inline${feedback.dislike ? ' with-comment' : ''}`}>
              <div className="taskrun-feedback-actions">
                <LikeOutlined
                  style={{ fontSize: 16, color: feedback.like ? '#1890ff' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'like')}
                />
                <DislikeOutlined
                  style={{ fontSize: 16, color: feedback.dislike ? '#ff4d4f' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'dislike')}
                />
              </div>
              <Input
                size="small"
                placeholder="Add comment"
                value={feedback.commentInput || ''}
                onChange={e => handleCommentInput(rowKey, e.target.value)}
                onPressEnter={() => handleCommentSubmit(rowKey)}
                className="taskrun-feedback-comment-input"
                prefix={<MessageOutlined />}
                style={{ width: '100%' }}
                maxLength={50}
              />
            </div>
            {feedback.dislike && feedback.comment && (
              <div className="taskrun-feedback-comment" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {feedback.comment}
                <Tooltip title="Comments left for thumbs down.">
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Bias',
      dataIndex: 'violation',
      key: 'bias',
      render: (text, record) => {
        const rowKey = `${record.key || record.employee_id || record.employee_name}-bias`;
        const feedback = feedbackState[rowKey] || {};
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: text === 'Yes' ? 'red' : text === 'No' ? 'green' : undefined }}>{text === 'Yes' ? 'Detected' : text === 'No' ? 'Not Detected' : 'N/A'}</span>
            <div className={`taskrun-feedback-inline${feedback.dislike ? ' with-comment' : ''}`}>
              <div className="taskrun-feedback-actions">
                <LikeOutlined
                  style={{ fontSize: 16, color: feedback.like ? '#1890ff' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'like')}
                />
                <DislikeOutlined
                  style={{ fontSize: 16, color: feedback.dislike ? '#ff4d4f' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'dislike')}
                />
              </div>
              <Input
                size="small"
                placeholder="Add comment"
                value={feedback.commentInput || ''}
                onChange={e => handleCommentInput(rowKey, e.target.value)}
                onPressEnter={() => handleCommentSubmit(rowKey)}
                className="taskrun-feedback-comment-input"
                prefix={<MessageOutlined />}
                style={{ width: '100%' }}
                maxLength={50}
              />
            </div>
            {feedback.dislike && feedback.comment && (
              <div className="taskrun-feedback-comment" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {feedback.comment}
                <Tooltip title="Comments left for thumbs down.">
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Add new columns for Title Monitoring
  const titleMonitoringColumns = [
    {
      title: 'Name',
      dataIndex: 'employee_name',
      key: 'employee_name',
      sorter: (a, b) => a.employee_name.localeCompare(b.employee_name),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: () => 'LinkedIn',
    },
    {
      title: 'Title as per HR',
      dataIndex: 'Title as per HR',
      width: '20%',
      minWidth: 200,
      key: 'title_hr',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Title as per LinkedIn',
      dataIndex: 'Title as per LinkedIn',
      key: 'title_linkedin',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Category',
      dataIndex: 'Title Category',
      key: 'title_category',
      render: (text, record) => {
        const rowKey = `${record.key || record.employee_id || record.employee_name}-title`;
        const feedback = feedbackState[rowKey] || {};
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: typeof text === 'string' && text.trim() === 'Title Matching' ? 'green' : 'red' }}>{text || 'N/A'}</span>
            <div className={`taskrun-feedback-inline${feedback.dislike ? ' with-comment' : ''}`}>
              <div className="taskrun-feedback-actions">
                <LikeOutlined
                  style={{ fontSize: 16, color: feedback.like ? '#1890ff' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'like')}
                />
                <DislikeOutlined
                  style={{ fontSize: 16, color: feedback.dislike ? '#ff4d4f' : '#aaa' }}
                  onClick={() => handleFeedback(rowKey, 'dislike')}
                />
              </div>
              <Input
                size="small"
                placeholder="Add comment"
                value={feedback.commentInput || ''}
                onChange={e => handleCommentInput(rowKey, e.target.value)}
                onPressEnter={() => handleCommentSubmit(rowKey)}
                className="taskrun-feedback-comment-input"
                prefix={<MessageOutlined />}
                style={{ width: '100%' }}
                maxLength={50}
              />
            </div>
            {feedback.dislike && feedback.comment && (
              <div className="taskrun-feedback-comment" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {feedback.comment}
                <Tooltip title="Comments left for thumbs down.">
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  // Calculate formatted start date and time for political contributions task
  const politicalStartedTime = task && task.task_name === "Political Contributions - Alerts & Monitoring"
    ? allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.updated_at
    : null;

  const handleFreshRunClick = async () => {
    if (task && task.ai_agent) {
      // Store timestamp in local storage
      localStorage.setItem('freshRunClickTimestamp_' + task.collection_name, Date.now().toString());

      setExecutingRun(prev => ({ ...prev, [task.collection_name]: true }));
      setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Executing' }));

      const cooldown = getFreshRunCooldown(task);
      // Set a timer to revert the button state after the cooldown
      const timer = setTimeout(() => {
        setExecutingRun(prev => ({ ...prev, [task.collection_name]: false }));
        setFreshRunButtonText(prev => ({ ...prev, [task.collection_name]: 'Execute fresh run' }));
        localStorage.removeItem('freshRunClickTimestamp_' + task.collection_name);
        fetchRunOptions(task); // Call fetchRunOptions after timer
        message.success('Fresh run execution completed. Data refreshed.'); // Show success message after data refresh
      }, cooldown);

      // try {
      //   // Correct API call to trigger a new run
      //   const response = await fetch(`${API_BASE_URL}/api/process-agent`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       agent_name: task.ai_agent.replace(/-/g, '_'),
      //     }),
      //   });

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     console.error('Error triggering fresh run:', response.status, errorData);
      //     message.error(`Failed to trigger fresh run: ${errorData.message || 'Unknown error'}`);
      //   } else {
      //     const result = await response.json();
      //     console.log('Fresh run initiated successfully:', result);
      //     message.info(`Fresh run initiated. Button will reset in ${cooldown / 60000} minutes.`);
      //   }
      // } catch (error) {
      //   console.error('Network or other error triggering fresh run:', error);
      //   message.error('Network error or other issue triggering fresh run.');
      // }
    } else {
      message.info('Fresh run is not available for this task type or missing collection name.');
    }
  };

  const handleDownloadExcel = () => {
    let fileUrl = '';
    let fileName = '';

    if (task && task.task_name === "Political Contributions - Alerts & Monitoring") {
      // Find the selected run's period
      const doc = allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId);
      const period = doc && doc.period ? doc.period.trim() : '';
      if (period === '2025-01-01 to 2025-05-31') {
        fileUrl = '/Political_contributions_report_Jan01_2025_to_May31_2025.xlsx';
        fileName = 'Political_contributions_report_Jan01_2025_to_May31_2025.xlsx';
      } else if (period === '2024-01-01 to 2024-12-31') {
        fileUrl = '/Political_contributions_report_Jan01_2024_to_Dec31_2024.xlsx';
        fileName = 'Political_contributions_report_Jan01_2024_to_Dec31_2024.xlsx';
      } else {
        fileUrl = '/Political Contribution Details.xlsx';
        fileName = 'Political Contribution Details.xlsx';
      }
    } else if (task && task.task_name === "Social Media - Alerts & Monitoring") {
      fileUrl = '/Social_media_alert_monitoring_report_20250620.xlsx';
      fileName = 'Social_media_alert_monitoring_report_20250620.xlsx';
    } else {
      message.info('No report available for this task.');
      return;
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('Report downloaded successfully');
  };

  const handleLogout = () => {
    // In a real application, you would clear authentication tokens or session here
    navigate('/login'); // Redirect to login page
  };

  // Place this before the return statement in the component, after all state and effect hooks:
  const sortedTitleMonitoringData = monitoringType === 'title'
    ? socialMediaAnalysisData.slice().sort((a, b) => {
        const aCat = a['Title Category'] === 'Title Matching' ? 2 : 1;
        const bCat = b['Title Category'] === 'Title Matching' ? 2 : 1;
        if (aCat !== bCat) return aCat - bCat;
        return a.employee_name.localeCompare(b.employee_name);
      })
    : socialMediaAnalysisData;

  const sortedKeywordMonitoringData = monitoringType === 'keyword'
    ? socialMediaAnalysisData.slice().sort((a, b) => {
        const aCount = (() => { try { return JSON.parse(a.keywords_hit).length; } catch { return 0; } })();
        const bCount = (() => { try { return JSON.parse(b.keywords_hit).length; } catch { return 0; } })();
        return bCount - aCount; // Descending order
      })
    : socialMediaAnalysisData;

  const renderDetailsContent = () => {
    if (!task) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Empty description="No task data available." />
        </div>
      );
    }

    if (task && task.task_name === "Political Contributions - Alerts & Monitoring") {
      return (
        <>
          <Divider className="taskrun-divider" />
          <Row gutter={32} className="taskrun-summary-row">
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Started At</Text>
              <div className="taskrun-summary-value">{politicalStartedTime ? dayjs.utc(politicalStartedTime).tz('America/New_York').format('MM/DD/YYYY HH:mm') : 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Completed At</Text>
              <div className="taskrun-summary-value">{
                (() => {
                  const doc = allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId);
                  if (doc && doc.updated_at && doc.duration !== undefined && doc.duration !== null) {
                    return dayjs.utc(doc.updated_at).add(doc.duration, 'second').tz('America/New_York').format('MM/DD/YYYY HH:mm');
                  }
                  return 'N/A';
                })()
              }</div>
            </Col>
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Duration</Text>
              <div className="taskrun-summary-value">{allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.duration !== undefined && allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.duration !== null ? formatDuration(allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId).duration) : 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Period Considered</Text>
              <div className="taskrun-summary-value">{
                (() => {
                  const doc = allPoliticalContributionsData.find(d => d.updated_at === selectedRunId);
                  console.log('Currently selected run doc:', doc);
                  if (doc && doc.period) {
                    console.log('Period string:', doc.period);
                    const [startDateStr, endDateStr] = doc.period.split(' to ');
                    console.log('Start Date String:', startDateStr, 'End Date String:', endDateStr);
                    const startDate = dayjs(startDateStr);
                    const endDate = dayjs(endDateStr);
                    console.log('Parsed Start Date (isValid):', startDate.isValid(), 'Parsed End Date (isValid):', endDate.isValid());

                    const formattedStartDate = startDate.isValid() ? startDate.format('MMM D, YYYY') : 'Invalid Date';
                    const formattedEndDate = endDate.isValid() ? endDate.format('MMM D, YYYY') : 'Invalid Date';

                    return `${formattedStartDate} - ${formattedEndDate}`;
                  }
                  return 'N/A';
                })()
              }</div>
            </Col>
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Employees Analyzed</Text>
              <div className="taskrun-summary-value">{politicalContributionEmployees.length}</div>
            </Col>
            <Col xs={24} sm={12} md={4} className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Contribution Category</Text>
              <Select
                mode="multiple"
                allowClear
                className="taskrun-select-filter"
                placeholder="Select categories"
                onChange={(values) => { setContributionCategoryFilter(values); setCurrentPage(1); }}
                value={contributionCategoryFilter}
                options={contributionCategoryOptions}
                size="large"
              />
            </Col>
          </Row>
          <Divider className="taskrun-divider" />
          <Table
            columns={politicalTableColumns}
            dataSource={politicalContributionEmployees}
            loading={loading}
            rowKey="employee_id"
            className="taskrun-table"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: politicalContributionEmployees.length,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                console.log('Political Table Pagination Change: Page', page, 'Size', size);
              },
              showSizeChanger: {
                size: 'default',
                dropdownMatchSelectWidth: false,
                style: { height: 32, lineHeight: '32px' },
                selectProps: { style: { height: 32, lineHeight: '32px' } }
              },
              pageSizeOptions: ['10', '25', '50', '100'],
              size: 'default',
            }}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadExcel}
              size="large"
              style={{ height: '45px' }}
            >
              Download Report
            </Button>
          </div>
        </>
      );
    } else if (task && task.task_name === "Social Media - Alerts & Monitoring") {
      return (
        <>
          <Divider className="taskrun-divider" />
          <Row gutter={32} className="taskrun-summary-row">
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Started At</Text>
              <div className="taskrun-summary-value">{allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.updated_at ? dayjs.utc(allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.updated_at).tz('America/New_York').format('MM/DD/YYYY HH:mm') : 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Completed At</Text>
              <div className="taskrun-summary-value">{
                (() => {
                  const doc = allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId);
                  if (doc && doc.updated_at && doc.duration !== undefined && doc.duration !== null) {
                    return dayjs.utc(doc.updated_at).add(doc.duration, 'second').tz('America/New_York').format('MM/DD/YYYY HH:mm');
                  }
                  return 'N/A';
                })()
              }</div>
            </Col>
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Duration</Text>
              <div className="taskrun-summary-value">{allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.duration !== undefined && allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId)?.duration !== null ? formatDuration(allPoliticalContributionsData.find(doc => doc.updated_at === selectedRunId).duration) : 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Period Considered</Text>
              <div className="taskrun-summary-value">{
                (() => {
                  const doc = allPoliticalContributionsData.find(d => d.updated_at === selectedRunId);
                  if (doc && doc.period) {
                    const [startDateStr, endDateStr] = doc.period.split(' to ');
                    const startDate = dayjs(startDateStr);
                    const endDate = dayjs(endDateStr);
                    const formattedStartDate = startDate.isValid() ? startDate.format('MMM D, YYYY') : 'Invalid Date';
                    const formattedEndDate = endDate.isValid() ? endDate.format('MMM D, YYYY') : 'Invalid Date';
                    return `${formattedStartDate} - ${formattedEndDate}`;
                  }
                  return 'N/A';
                })()
              }</div>
            </Col>
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              <Text type="secondary" className="taskrun-summary-label">Employees Analyzed</Text>
              <div className="taskrun-summary-value">{socialMediaAnalysisData.length}</div>
            </Col>
            <Col xs={24} sm={12} flex="auto" className="taskrun-summary-col">
              {monitoringType === 'title' ? null : null}
            </Col>
          </Row>
          {/* Filters below summary, now side by side */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 32, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Text type="secondary" className="taskrun-summary-label" style={{ marginRight: 0, fontWeight: 'bold', fontSize: '20px' }}>
                Monitoring Type
              </Text>
              <Select
                className="monitoring-type-select"
                value={monitoringType}
                onChange={(value) => {
                  setMonitoringType(value);
                  // Force clear all filters by setting to [] first, then to ['all']
                  setKeywordsFilter([]);
                  setBiasFilter([]);
                  setTitleCategoryFilter([]);
                  setTimeout(() => {
                    setKeywordsFilter(['all']);
                    setBiasFilter(['all']);
                    setTitleCategoryFilter(['all']);
                  }, 0);
                  setCurrentPage(1);
                }}
                options={[
                  { label: 'Post Monitoring', value: 'keyword' },
                  { label: 'Title Monitoring', value: 'title' }
                ]}
                style={{ width: 200 }}
                size="large"
                dropdownMatchSelectWidth={false}
              />
            </div>
            {monitoringType === 'keyword' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Text type="secondary" className="taskrun-summary-label" style={{ marginRight: 12 }}>Key Words Found</Text>
                  <Select
                    key={`keywords-select-${monitoringType}`}
                    mode="multiple"
                    allowClear
                    className="taskrun-select-filter"
                    placeholder="Filter by Keywords"
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setKeywordsFilter(['all']);
                      } else if (selectedValues[selectedValues.length - 1] === 'all') {
                        setKeywordsFilter(['all']);
                      } else {
                        setKeywordsFilter(selectedValues.filter(value => value !== 'all'));
                      }
                      setCurrentPage(1);
                    }}
                    value={keywordsFilter}
                    options={keywordsOptions}
                    size="large"
                    style={{ width: 260 }}
                    maxTagCount={0}
                    maxTagPlaceholder={omittedValues => (
                      <Tooltip title={keywordsFilter.map(val => {
                        const option = keywordsOptions.find(opt => opt.value === val);
                        return option ? option.label : val;
                      }).join(', ')}>
                        {`${keywordsFilter.length} selected`}
                      </Tooltip>
                    )}
                  />
                  <Text type="secondary" className="taskrun-summary-label" style={{ marginLeft: 24, marginRight: 12 }}>Bias</Text>
                  <Select
                    key={`bias-select-${monitoringType}`}
                    mode="multiple"
                    allowClear
                    className="taskrun-select-filter"
                    placeholder="Filter by Bias Status"
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setBiasFilter(['all']);
                      } else if (selectedValues[selectedValues.length - 1] === 'all') {
                        setBiasFilter(['all']);
                      } else {
                        setBiasFilter(selectedValues.filter(value => value !== 'all'));
                      }
                      setCurrentPage(1);
                    }}
                    value={biasFilter}
                    options={biasOptions}
                    size="large"
                    style={{ width: 260 }}
                    maxTagCount={0}
                    maxTagPlaceholder={omittedValues => (
                      <Tooltip title={biasFilter.map(val => {
                        const option = biasOptions.find(opt => opt.value === val);
                        return option ? option.label : val;
                      }).join(', ')}>
                        {`${biasFilter.length} selected`}
                      </Tooltip>
                    )}
                  />
                </div>
              </>
            )}
            {monitoringType === 'title' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text type="secondary" className="taskrun-summary-label" style={{ marginLeft: 24, marginRight: 12 }}>Category</Text>
                <Select
                  key={`category-select-${monitoringType}`}
                  mode="multiple"
                  allowClear
                  className="taskrun-select-filter"
                  placeholder="Select Title Category"
                  onChange={(selectedValues) => {
                    if (selectedValues.length === 0) {
                      setTitleCategoryFilter(['all']);
                    } else if (selectedValues[selectedValues.length - 1] === 'all') {
                      setTitleCategoryFilter(['all']);
                    } else {
                      setTitleCategoryFilter(selectedValues.filter(value => value !== 'all'));
                    }
                    setCurrentPage(1);
                  }}
                  value={titleCategoryFilter}
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Title Matching', value: 'Title Matching' },
                    { label: 'Title Not Matching', value: 'Title Not Matching' },
                  ]}
                  size="large"
                  style={{ width: 200 }}
                  maxTagCount={0}
                  maxTagPlaceholder={omittedValues => (
                    <Tooltip title={titleCategoryFilter.map(val => {
                      const option = [
                        { label: 'All', value: 'all' },
                        { label: 'Title Matching', value: 'Title Matching' },
                        { label: 'Title Not Matching', value: 'Title Not Matching' }
                      ].find(opt => opt.value === val);
                      return option ? option.label : val;
                    }).join(', ')}>
                      {`${titleCategoryFilter.length} selected`}
                    </Tooltip>
                  )}
                />
              </div>
            )}
          </div>
          <Divider className="taskrun-divider" />
          <Table
            columns={monitoringType === 'keyword' ? socialMediaTableColumns : titleMonitoringColumns}
            dataSource={monitoringType === 'keyword' ? sortedKeywordMonitoringData : sortedTitleMonitoringData}
            loading={loading}
            rowKey="employee_name"
            className="taskrun-table"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: monitoringType === 'keyword'
                ? socialMediaAnalysisData.length
                : socialMediaAnalysisData
                    .map(item => ({
                      ...item,
                      // Prefer top-level fields, fallback to tittle_matching_details if needed
                      'Title as per HR': item['Title as per HR'] || (item.tittle_matching_details ? (JSON.parse(item.tittle_matching_details)['title_hr'] || '') : ''),
                      'Title as per LinkedIn': item['Title as per LinkedIn'] || (item.tittle_matching_details ? (JSON.parse(item.tittle_matching_details)['title_linkedin'] || '') : ''),
                      'Title Category': item['Title Category'] || (item.tittle_matching_details ? ((JSON.parse(item.tittle_matching_details)['matching_result'] ? 'Title Matching' : 'Not Matching')) : ''),
                    }))
                    .filter(item => item['Title as per HR'] && item['Title as per LinkedIn'] && item['Title Category']).length,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                console.log('Social Media Table Pagination Change: Page', page, 'Size', size);
              },
              showSizeChanger: {
                size: 'default',
                dropdownMatchSelectWidth: false,
                style: { height: 32, lineHeight: '32px' },
                selectProps: { style: { height: 32, lineHeight: '32px' } }
              },
              pageSizeOptions: ['10', '25', '50', '100'],
              size: 'default',
            }}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadExcel}
              size="large"
              style={{ height: '45px' }}
            >
              Download Report
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <div className="taskrun-default-content">
          <Text>Select a task to view details.</Text>
        </div>
      );
    }
  };

  // Handler for thumbs up/down
  const handleFeedback = (rowKey, type) => {
    setFeedbackState(prev => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        like: type === 'like' ? !prev[rowKey]?.like : false,
        dislike: type === 'dislike' ? !prev[rowKey]?.dislike : false,
      }
    }));
  };

  // Handler for comment input change
  const handleCommentInput = (rowKey, value) => {
    setFeedbackState(prev => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        commentInput: value,
      }
    }));
  };

  // Handler for comment submit
  const handleCommentSubmit = (rowKey) => {
    if (feedbackState[rowKey]?.commentInput?.trim()) {
      setFeedbackState(prev => ({
        ...prev,
        [rowKey]: {
          ...prev[rowKey],
          comment: prev[rowKey].commentInput,
          commentInput: '',
        }
      }));
    }
  };

  return (
    <div className="taskrun-container">
      <Header title="Sophia - Xponance's AI Compliance Agent" />
      {/* Filter Row */}
      <Row gutter={16} align="middle" className="taskrun-filter-row-container">
        {/* Run Filter */}
        <Col flex="auto" className="taskrun-filter-col">
              <Select
                value={selectedRunId}
            onChange={setSelectedRunId}
                options={runOptions}
            placeholder="Select a run"
                size="large"
            className="taskrun-select"
            style={{ width: '100%' }}
              />
            </Col>
        {/* Employee Search */}
        {
          !isInstructionsTask && (
        <Col flex="auto" className="taskrun-filter-col">
          <Input.Search
            placeholder="Search employee..."
              allowClear
            onSearch={(value) => { setEmployeeSearch(value); setCurrentPage(1); }}
            onChange={(e) => { setEmployeeSearch(e.target.value); setCurrentPage(1); }}
                size="large"
            style={{}}
            suffix={<SearchOutlined />}
              />
            </Col>
          )
        }
              <Col>
          <Button
            type="primary"
            // onClick={() => handleFreshRunClick(task.collection_name)}
            loading={executingRun[task.collection_name]}
            disabled={executingRun[task.collection_name]}
                  size="large"
            icon={<CaretRightOutlined />}
            className="ant-btn-lg"
            style={{ height: '45px' }}
          >
            {freshRunButtonText[task.collection_name] || 'Execute fresh run'}
          </Button>
              </Col>
        </Row>

      {/* Task Details Card */}
      <Card className="taskrun-details-card" loading={loading}>
        {/* Task-specific header for the content area */}
        {task && (
          <div className="taskrun-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <Title level={4} className="taskrun-title" style={{ marginBottom: 0 }}>
                {task.task_name || "Task Details"} Analysis Run
              </Title>
            </div>
            {!isInstructionsTask && !(task.task_name === 'Compliance Calendar Management' && effectiveStatusKey === 'Under training') && (
              <Tag
                className={`taskrun-status-tag ${effectiveStatusKey.toLowerCase().replace(/ /g, '-')}`}
                style={{
                  background: statusInfo.color,
                  color: statusInfo.textColor,
                }}
                icon={statusInfo.icon}
              >
                {statusInfo.label}
              </Tag>
            )}
          </div>
        )}
        {/* Main content area: show table for Compliance Calendar Management, else normal details */}
        {task && task.task_name === 'Compliance Calendar Management'
          ? (
            <>
              <Divider className="taskrun-divider" />
              {/* Real-time AI logs UI */}
              <div style={{ padding: '16px 0' }}>
                <Title level={5} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 22 }} /> Instructions
                </Title>
                {(() => {
                  if (typeof task.instructions === 'string' && task.instructions.trim()) {
                    return (
                      <Card
                        bordered={false}
                        style={{
                          background: 'linear-gradient(90deg, #f0f7ff 0%, #e6f7ff 100%)',
                          boxShadow: '0 2px 12px rgba(24, 144, 255, 0.08)',
                          borderRadius: 10,
                          marginBottom: 16,
                          padding: 0,
                        }}
                        bodyStyle={{ padding: 0 }}
                      >
                        <div style={{
                          padding: '18px 24px',
                          fontSize: 17,
                          color: '#222',
                          lineHeight: 1.7,
                          fontFamily: 'Segoe UI, Arial, sans-serif',
                          position: 'relative',
                          minHeight: 48,
                          wordBreak: 'break-word',
                        }}>
                          <div dangerouslySetInnerHTML={{ __html: instructionsToHtml(task.instructions) }} />
                          <Tooltip title="Copy all instructions">
                            <Button
                              shape="circle"
                              icon={<CopyOutlined />}
                              size="small"
                              style={{ position: 'absolute', top: 12, right: 16, background: '#e6f7ff', border: 'none' }}
                              onClick={() => {
                                navigator.clipboard.writeText(task.instructions);
                                message.success('Instructions copied!');
                              }}
                            />
                          </Tooltip>
                        </div>
                      </Card>
                    );
                  }
                  // fallback for array or no instructions
                  let steps = [];
                  if (Array.isArray(task.instructions)) {
                    steps = task.instructions;
                  } else if (typeof task.instructions === 'string' && task.instructions.trim()) {
                    // Try to split by numbered steps (e.g., '1.', '2.', etc.)
                    const regex = /\s*\d+\.[^\d]*/g;
                    const matches = task.instructions.match(regex);
                    if (matches && matches.length > 1) {
                      // Split by numbered steps
                      steps = task.instructions.split(/\s*\d+\./).filter(Boolean).map(s => s.trim());
                    } else {
                      // Fallback: split by newlines
                      steps = task.instructions.split(/\n|\r/).filter(Boolean).map(s => s.trim());
                    }
                  }
                  if (steps.length > 0) {
                    return (
                      <Card
                        bordered={false}
                        style={{
                          background: 'linear-gradient(90deg, #f0f7ff 0%, #e6f7ff 100%)',
                          boxShadow: '0 2px 12px rgba(24, 144, 255, 0.08)',
                          borderRadius: 10,
                          marginBottom: 16,
                          padding: 0,
                        }}
                        bodyStyle={{ padding: 0 }}
                      >
                        <div style={{
                          padding: '18px 24px',
                          fontSize: 17,
                          color: '#222',
                          lineHeight: 1.7,
                          fontFamily: 'Segoe UI, Arial, sans-serif',
                          position: 'relative',
                          minHeight: 48,
                          wordBreak: 'break-word',
                        }}>
                          <List
                            itemLayout="horizontal"
                            dataSource={steps}
                            renderItem={(item, idx) => (
                              <List.Item style={{ padding: '14px 0', border: 'none', alignItems: 'flex-start', background: idx % 2 === 0 ? '#f7fbff' : '#e6f7ff', borderRadius: 8, marginBottom: 6 }}>
                                <List.Item.Meta
                                  avatar={<span style={{ fontWeight: 700, color: '#1677ff', fontSize: 22, minWidth: 32, display: 'inline-block', textAlign: 'right', fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif' }}>{idx + 1}.</span>}
                                  description={<span style={{ fontSize: 18, color: '#222', fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: 0.1, lineHeight: 1.8 }}>{item}</span>}
                                />
                              </List.Item>
                            )}
                          />
                          <Tooltip title="Copy all instructions">
                            <Button
                              shape="circle"
                              icon={<CopyOutlined />}
                              size="small"
                              style={{ position: 'absolute', top: 12, right: 16, background: '#e6f7ff', border: 'none' }}
                              onClick={() => {
                                navigator.clipboard.writeText(steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
                                message.success('Instructions copied!');
                              }}
                            />
                          </Tooltip>
                        </div>
                      </Card>
                    );
                  } else {
                    return (
                      <div style={{ color: '#888', fontStyle: 'italic', fontSize: 16, padding: '18px 24px', background: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
                        No instructions provided.
                      </div>
                    );
                  }
                })()}
              </div>
              {/* <div style={{ marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>Agent Execution Logs</Title>
                <div style={{
                  background: '#1a1a1a',
                  color: '#e6e6e6',
                  borderRadius: 6,
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  maxHeight: 300,
                  overflowY: 'auto',
                  marginBottom: 24,
                  border: '1px solid #333',
                }}>
                  {calendarLogs.length > 0
                    ? calendarLogs.map((line, idx) => (
                        <div key={idx} style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{line}</div>
                      ))
                    : <div>No logs yet.</div>
                  }
                </div>
              </div> */}
            </>
          )
          : renderDetailsContent()
        }
      </Card>
    </div>
  );
};

export default TaskRunDetails; 