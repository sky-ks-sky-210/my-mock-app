import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Typography, Box, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import ExpenseTable from './ExpenseTable';
import ExpenditureRegistrationForm from './ExpenditureRegistrationForm';
import RemainingBalanceTable from './RemainingBalanceTable';
import WeeklyFoodBalanceTable from './WeeklyFoodBalanceTable';
import ExpensesChart from './ExpensesChart';
import ExpensesChartTotal from './ExpensesChartTotal';
import DailyExpensesChart from './DailyExpensesChart';

const App = () => {
  // 現在の年月を取得
  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  const [activeTab, setActiveTab] = useState(0);
  const [selectedYearMonth, setSelectedYearMonth] = useState(getCurrentYearMonth()); // 初期値を現在の年月に変更
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshData = () => {
    setRefreshFlag((prev) => !prev); // フラグの切り替えでリフレッシュをトリガー
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleYearMonthChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedYearMonth(selectedValue);
    refreshData(); // 年月が変更された際にデータをリフレッシュする
  };

  // 年月の選択肢を生成
  const generateYearMonthOptions = () => {
    const options = [];
    const startYear = 2024;
    const endYear = 2030;
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const formattedMonth = month.toString().padStart(2, "0");
        options.push(`${year}-${formattedMonth}`);
      }
    }
    return options;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ marginBottom: 4 }}>
        支出管理
      </Typography>

      {/* 年月選択プルダウン */}
      <FormControl sx={{ marginBottom: 2, minWidth: 200 }}>
        <InputLabel id="yearMonthSelectLabel">年月</InputLabel>
        <Select
          labelId="yearMonthSelectLabel"
          id="yearMonthSelect"
          value={selectedYearMonth}
          onChange={handleYearMonthChange}
        >
          {generateYearMonthOptions().map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* タブエリア */}
      <Box sx={{ overflowX: 'auto', marginBottom: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="expense management tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="食費予算残高(週)" />
          <Tab label="支出予算残高(月)" />
          <Tab label="支出登録" />
          <Tab label="支出一覧" />
          <Tab label="支出グラフ(流動費)" />
          <Tab label="支出グラフ(トータル)" />
          <Tab label="日別支出額" />
        </Tabs>
      </Box>

      <Box sx={{ marginTop: 3 }}>
        {/* タブの内容を切り替え */}
        {activeTab === 0 && <WeeklyFoodBalanceTable selectedYearMonth={selectedYearMonth} />}
        {activeTab === 1 && <RemainingBalanceTable selectedYearMonth={selectedYearMonth} />}
        {activeTab === 2 && <ExpenditureRegistrationForm onAddExpense={refreshData} />}
        {activeTab === 3 && <ExpenseTable refreshFlag={refreshFlag} selectedYearMonth={selectedYearMonth} />}
        {activeTab === 4 && <ExpensesChart selectedYearMonth={selectedYearMonth} />}
        {activeTab === 5 && <ExpensesChartTotal selectedYearMonth={selectedYearMonth} />}
        {activeTab === 6 && <DailyExpensesChart selectedYearMonth={selectedYearMonth} />}
      </Box>
    </Container>
  );
};

export default App;
