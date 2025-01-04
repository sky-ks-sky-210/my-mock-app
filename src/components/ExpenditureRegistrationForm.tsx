import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

const ExpenditureRegistrationForm = ({ onAddExpense }: { onAddExpense: () => void }) => {
  const [formData, setFormData] = useState({
    item: '',
    expense_date: '',
    price: '',
    detail: '',
    category_id: '', // 新たに追加
  });
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]); // カテゴリ情報を保持

  // カテゴリ情報をAPIから取得する
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.11.212:3001/api/categories');
        const data = await response.json();
        setCategories(data); // APIから取得したカテゴリ情報をセット
      } catch (err) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // handleChange関数をSelectChangeEventに対応
  const handleChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // 送信するデータから「目的」を除外する処理は削除
      const response = await fetch('http://192.168.11.212:3001/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register expense');
      }

      onAddExpense();
      setFormData({ item: '', expense_date: '', price: '', detail: '', category_id: '' }); // フォームをリセット
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>} {/* エラーメッセージに余白追加 */}
      <TextField
        fullWidth
        label="項目"
        name="item"
        value={formData.item}
        onChange={handleChange}
        margin="dense"
        required
      />
      <TextField
        fullWidth
        type="date"
        label="日付"
        name="expense_date"
        value={formData.expense_date}
        onChange={handleChange}
        margin="dense"
        InputLabelProps={{ shrink: true }}
        required
      />
      <FormControl fullWidth margin="dense" required>
        <InputLabel>カテゴリ</InputLabel>
        <Select
          label="カテゴリ"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <MenuItem key={category.category_id} value={category.category_id}>
              {category.category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        type="number"
        label="値段"
        name="price"
        value={formData.price}
        onChange={handleChange}
        margin="dense"
        required
      />
      <TextField
        fullWidth
        label="詳細"
        name="detail"
        value={formData.detail}
        onChange={handleChange}
        margin="dense"
        multiline
        rows={1}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        登録
      </Button>
    </Box>
  );
};

export default ExpenditureRegistrationForm;
