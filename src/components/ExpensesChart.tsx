import ApiConfig from "./ApiConfig";
import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// 必須プラグインを登録
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensesChart = ({
  selectedYearMonth,
}: {
  selectedYearMonth: string;
}) => {
  const [data, setData] = useState<any[]>([]); // APIから取得したデータ
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiConfig.apiBaseUrl}/api/remaining-balance?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error("Error fetching remaining balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYearMonth]);

  if (loading) {
    return <CircularProgress />;
  }

  // 総支出額の計算
  const totalSpent = data.reduce(
    (acc, row) => acc + parseFloat(row.total_price),
    0
  );

  // HSLでカラーを生成
  const generateColors = (count: number) => {
    const colors = [];
    const hueIncrement = 360 / count; // 色相の範囲を均等に分ける
    for (let i = 0; i < count; i++) {
      const hue = i * hueIncrement; // 色相を変更
      const color = `hsl(${hue}, 70%, 60%)`; // 明度70%、彩度60%で色を生成
      colors.push(color);
    }
    return colors;
  };

  // 色生成
  const colors = generateColors(data.length);

  // 円グラフデータの作成
  const chartData = {
    labels: data.map((row) => row.category_name), // カテゴリ名をラベルに設定
    datasets: [
      {
        label: "支出額",
        data: data.map((row) => parseFloat(row.total_price)), // 支出額をデータに設定
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
        text: `総支出: ${totalSpent.toLocaleString()} 円`, // 円グラフのタイトルに総支出額を表示
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
            <strong>カテゴリ別支出</strong>
          </Box>
        </Paper>
      </Box>

      {/* レスポンシブ対応で円グラフと表のレイアウトを切り替え */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // 画面幅に応じて縦並び、横並びを切り替え
          gap: 4,
          alignItems: "center", // 両方をセンタリング
          justifyContent: "center",
        }}
      >
        {/* 円グラフ */}
        <Box sx={{ maxWidth: 800, width: "100%", maxHeight: 800 }}>
          <Doughnut data={chartData} options={options} />
        </Box>

        {/* 支出額と予算額を表で表示 */}
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>カテゴリ</strong></TableCell>
                  <TableCell><strong>予算額</strong></TableCell>
                  <TableCell><strong>支出額</strong></TableCell>
                  <TableCell><strong>割合</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => {
                  const value = parseFloat(row.total_price);
                  const percentage = ((value / totalSpent) * 100).toFixed(2);
                  // APIレスポンスから予算額を取得
                  const budget = parseFloat(row.budget_amount);
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

export default ExpensesChart;
