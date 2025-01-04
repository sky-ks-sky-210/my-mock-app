import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import ApiConfig from "./ApiConfig";
import EditExpenseModal from './EditExpenseModal';

const ExpenseTable = ({ refreshFlag, selectedYearMonth }: { refreshFlag: boolean; selectedYearMonth: string }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // 確認ダイアログ用の状態
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ApiConfig.apiBaseUrl}/api/expenses?yearMonth=${JSON.stringify({ yearMonth: selectedYearMonth })}`);
      if (!response.ok) throw new Error('データの取得に失敗しました');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const response = await fetch(`${ApiConfig.apiBaseUrl}/api/expenses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('データの削除に失敗しました');
      setExpenses(expenses.filter((expense: any) => expense.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteExpense(deleteTargetId);
    }
    setDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleEditClick = (expense: any) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleUpdateExpense = async (updatedExpense: { id: number, item: string, expense_date: string, object: string, price: number, detail: string }) => {
    try {
      await fetch(`${ApiConfig.apiBaseUrl}/api/expenses/${updatedExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExpense),
      });
      setOpenModal(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [refreshFlag]);

  if (loading) return <Typography>読み込み中...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>項目</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell>値段</TableCell>
              <TableCell>詳細</TableCell>
              <TableCell>削除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense: any) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.id}</TableCell>
                <TableCell>{expense.item}</TableCell>
                <TableCell>{expense.expense_date}</TableCell>
                <TableCell>{expense.category_name}</TableCell>
                <TableCell>{expense.price}</TableCell>
                <TableCell>{expense.detail}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteClick(expense.id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <EditExpenseModal
          open={openModal}
          expense={selectedExpense}
          onClose={() => setOpenModal(false)}
          onSave={handleUpdateExpense}
        />
      </TableContainer>

      {/* 確認ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当にこの項目を削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">いいえ</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>はい</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseTable;
