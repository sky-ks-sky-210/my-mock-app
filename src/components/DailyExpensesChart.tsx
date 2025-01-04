import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CircularProgress, Box, Paper } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ApiConfig from './ApiConfig';

// 必須プラグインを登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DailyExpensesChart = ({ selectedYearMonth }: { selectedYearMonth: string }) => {
  const [data, setData] = useState<any[]>([]); // APIから取得したデータ
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ApiConfig.apiBaseUrl}/api/daily-expenses?yearMonth=${JSON.stringify({ yearMonth: selectedYearMonth })}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching daily expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYearMonth]);

  if (loading) {
    return <CircularProgress />;
  }

  // 折れ線グラフのデータ設定
  const chartData = {
    labels: data.map((item) => item.expense_date), // 日付
    datasets: [
      {
        label: '支出額',
        data: data.map((item) => parseFloat(item.total_expense)), // 支出額
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.0, // 線の滑らかさ
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '日別支出額',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日付',
        },
      },
      y: {
        title: {
          display: true,
          text: '支出額 (円)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Box sx={{ marginBottom: 4, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <Line data={chartData} options={options} />
        </Box>
      </Box>
    </Box>
  );
};

export default DailyExpensesChart;
