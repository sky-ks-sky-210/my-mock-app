import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const EditExpenseModal = ({ open, expense, onClose, onSave }: any) => {
  if (!expense) return null;  // 追加: 選択されたエクスペンスが存在しない場合はレンダリングしない

  const [updatedExpense, setUpdatedExpense] = React.useState(expense);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedExpense({ ...updatedExpense, [name]: value });
  };

  const handleSubmit = async () => {
    onSave(updatedExpense);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>エクスペンスの編集</DialogTitle>
      <DialogContent>
        <TextField
          label="項目"
          fullWidth
          name="item"
          value={updatedExpense.item}
          onChange={handleChange}
        />
        <TextField
          label="日付"
          fullWidth
          name="expense_date"
          value={updatedExpense.expense_date}
          onChange={handleChange}
        />
        <TextField
          label="目的"
          fullWidth
          name="object"
          value={updatedExpense.object}
          onChange={handleChange}
        />
        <TextField
          label="値段"
          fullWidth
          name="price"
          type="number"
          value={updatedExpense.price}
          onChange={handleChange}
        />
        <TextField
          label="詳細"
          fullWidth
          name="detail"
          value={updatedExpense.detail}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleSubmit} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseModal;
