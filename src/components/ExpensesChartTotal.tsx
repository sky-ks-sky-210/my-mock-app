import ApiConfig from "./ApiConfig";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { CircularProgress, Box, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// 必須プラグインを登録
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensesChartTotal = ({
  selectedYearMonth,
}: {
  selectedYearMonth: string;
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiConfig.apiBaseUrl}/api/total-expenses?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching total expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYearMonth]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalSpent = data.reduce(
    (acc, row) => acc + parseFloat(row.total_expense),
    0
  );

  const generateColors = (count: number) => {
    const colors = [];
    const hueIncrement = 360 / count;
    for (let i = 0; i < count; i++) {
      const hue = i * hueIncrement;
      const color = `hsl(${hue}, 70%, 60%)`;
      colors.push(color);
    }
    return colors;
  };

  const colors = generateColors(data.length);

  const chartData = {
    labels: data.map((row) => row.category_name),
    datasets: [
      {
        label: "支出額",
        data: data.map((row) => parseFloat(row.total_expense)),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `総支出: ${totalSpent.toLocaleString()} 円`,
        font: {
          size: 18,
        },
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / totalSpent) * 100).toFixed(2);
            return `${context.label}: ${value.toLocaleString()} 円 (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Paper sx={{ padding: 2, display: "inline-block" }}>
          <Box>
            <strong>カテゴリ別支出概要</strong>
          </Box>
        </Paper>
      </Box>

      {/* レスポンシブ対応で円グラフと表のレイアウトを切り替え */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 円グラフ */}
        <Box sx={{ maxWidth: 800, width: "100%", maxHeight: 800 }}>
          <Doughnut data={chartData} options={options} />
        </Box>

        {/* 表 */}
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>カテゴリ名</strong></TableCell>
                  <TableCell><strong>予算額 (円)</strong></TableCell>
                  <TableCell><strong>支出額 (円)</strong></TableCell>
                  <TableCell><strong>割合 (%)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => {
                  const value = parseFloat(row.total_expense);
                  const percentage = ((value / totalSpent) * 100).toFixed(2);
                  const budget = parseFloat(row.monthly_budget_amount);
                  return (
                    <TableRow key={index}>
                      <TableCell>{row.category_name}</TableCell>
                      <TableCell>{budget.toLocaleString()} 円</TableCell>
                      <TableCell>{value.toLocaleString()} 円</TableCell>
                      <TableCell>{percentage} %</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpensesChartTotal;
