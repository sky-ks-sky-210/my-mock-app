import ApiConfig from "./ApiConfig";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const WeeklyFoodBalanceTable = ({
  selectedYearMonth,
}: {
  selectedYearMonth: string;
}) => {
  const [lunchData, setLunchData] = useState<any[]>([]);
  const [dinnerData, setDinnerData] = useState<any[]>([]);
  const [weekendMealData, setWeekendMealData] = useState<any[]>([]);
  const [snackData, setSnackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(4); // 表示する列数

  // 画面幅に応じた列数を計算
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width > 1200) {
        setColumns(4);
      } else if (width > 900) {
        setColumns(3);
      } else if (width > 600) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lunchResponse = await fetch(
          `${ApiConfig.apiBaseUrl}/api/get-weekday-lunch-budget-balance?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        setLunchData(await lunchResponse.json());

        const dinnerResponse = await fetch(
          `${ApiConfig.apiBaseUrl}/api/get-weekday-dinner-budget-balance?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        setDinnerData(await dinnerResponse.json());

        const weekendMealResponse = await fetch(
          `${ApiConfig.apiBaseUrl}/api/get-weekend-meal-budget-balance?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        setWeekendMealData(await weekendMealResponse.json());

        const snackResponse = await fetch(
          `${ApiConfig.apiBaseUrl}/api/get-weekday-snack-budget-balance?yearMonth=${JSON.stringify({
            yearMonth: selectedYearMonth,
          })}`
        );
        setSnackData(await snackResponse.json());
      } catch (error) {
        console.error("Error fetching weekly budget balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYearMonth]);

  if (loading) {
    return <CircularProgress />;
  }

  const calculateTotals = (data: any[]) => {
    const totalBudget = data.reduce((sum, row) => sum + Number(row.weekly_budget), 0);
    const totalBalance = data.reduce((sum, row) => sum + Number(row.remaining_balance), 0);
    return { totalBudget, totalBalance };
  };

  const renderTable = (title: string, data: any[]) => {
    const { totalBudget, totalBalance } = calculateTotals(data);

    return (
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 400,
          margin: "16px auto",
          overflowX: "auto",
        }}
      >
        <Box sx={{ padding: "16px", paddingBottom: 0 }}>
          <Typography variant="h6" align="left">
            {title}
          </Typography>
          <Typography variant="body2" align="left" sx={{ marginTop: "8px" }}>
            予算総額: {totalBudget.toLocaleString()}円
          </Typography>
          <Typography variant="body2" align="left">
            残高総額: {totalBalance.toLocaleString()}円
          </Typography>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>週番号</TableCell>
              <TableCell>予算</TableCell>
              <TableCell>残高</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.week_number}>
                <TableCell>{row.week_number}</TableCell>
                <TableCell>{Number(row.weekly_budget).toLocaleString()}</TableCell>
                <TableCell>{Number(row.remaining_balance).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderCalendar = () => {
    const [year, month] = selectedYearMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let currentWeek: (number | null)[] = new Array(firstDay.getDay()).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return (
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 400,
          margin: "16px auto",
          overflowX: "auto", // 横スクロールを許可
        }}
      >
        <Box sx={{ padding: "16px", paddingBottom: 0 }}>
          <Typography variant="h6" align="center">
            {year}年{month}月
          </Typography>
        </Box>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{
                    padding: "4px",
                    fontSize: "0.875rem",
                    width: `${100 / 7}%`, // 各セルの幅を均等に分割
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week, index) => (
              <TableRow key={index}>
                {week.map((day, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      padding: "4px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {day || ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };


  const tables = [
    { title: "昼食", data: lunchData },
    { title: "夕食", data: dinnerData },
    { title: "休日食費", data: weekendMealData },
    { title: "間食", data: snackData },
  ];

  return (
    <Box sx={{ padding: "16px", marginBottom: "24px" }}>
      <Grid container spacing={2}>
        {tables.map((table, index) => (
          <Grid item xs={12 / columns} key={index}>
            {renderTable(table.title, table.data)}
          </Grid>
        ))}
        <Grid item xs={12 / columns}>
          {renderCalendar()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeeklyFoodBalanceTable;
