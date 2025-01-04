import ApiConfig from "./ApiConfig";
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// 必須プラグインを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RemainingBalanceTable = ({ selectedYearMonth }: { selectedYearMonth: string }) => {
  const [data, setData] = useState<any[]>([]); // APIから取得したデータ
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ApiConfig.apiBaseUrl}/api/remaining-balance?yearMonth=${JSON.stringify({ yearMonth: selectedYearMonth })}`);
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error('Error fetching remaining balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYearMonth]);

  if (loading) {
    return <CircularProgress />;
  }

  // 総予算と総残高の計算
  const totalBudget = data.reduce((acc, row) => acc + parseFloat(row.budget_amount), 0);
  const totalRemaining = data.reduce((acc, row) => acc + parseFloat(row.remaining_balance), 0);
  const totalSpent = data.reduce((acc, row) => acc + parseFloat(row.total_price), 0);

  // グラフデータの作成
  const chartData = {
    labels: data.map((row) => row.category_name), // カテゴリ名をラベルに設定
    datasets: [
      {
        label: '予算',
        data: data.map((row) => parseFloat(row.budget_amount)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: '残高',
        data: data.map((row) => parseFloat(row.remaining_balance)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
        text: 'カテゴリごとの残高と予算',
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Box sx={{ marginBottom: 4, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <Bar data={chartData} options={options} />
        </Box>
      </Box>

      {/* 総額表示エリア */}
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Paper sx={{ padding: 2, display: 'inline-block' }}>
          <Box>
            <strong>総予算:</strong> {totalBudget.toLocaleString()} 円
          </Box>
          <Box>
            <strong>総支出:</strong> {totalSpent.toLocaleString()} 円
          </Box>
          <Box>
            <strong>総残高:</strong> {totalRemaining.toLocaleString()} 円
          </Box>
        </Paper>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>カテゴリ名</TableCell>
              <TableCell>予算額</TableCell>
              <TableCell>残高</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.category_id}>
                <TableCell>{row.category_name}</TableCell>
                <TableCell>{row.budget_amount.toLocaleString()}</TableCell>
                <TableCell>{row.remaining_balance.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RemainingBalanceTable;
