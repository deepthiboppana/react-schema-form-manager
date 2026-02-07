import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material';
import { Save, X } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { userFields } from '../config/fields';

const UserForm = ({ onSubmit, initialData, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      // Convert date string to dayjs object for the picker
      const dataWithDates = { ...initialData };
      if (initialData.dob) {
        dataWithDates.dob = dayjs(initialData.dob);
      }
      setFormData(dataWithDates);
    } else {
      const emptyData = {};
      userFields.forEach(f => emptyData[f.name] = (f.type === 'date' ? null : ''));
      setFormData(emptyData);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  const validateField = (name, value) => {
    const field = userFields.find(f => f.name === name);
    if (!field) return null;

    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      // If it's a dayjs object (for dob), we might need to handle it differently
      const valToValidate = (name === 'dob' && value) ? value.format('YYYY-MM-DD') : value;
      const result = field.validation(valToValidate);
      return result === true ? null : result;
    }
    
    return null;
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};
    userFields.forEach((field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) newErrors[field.name] = error;
      newTouched[field.name] = true;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Special logic for phone number: accept only numbers, max 10 digits
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        value = onlyNums;
      } else {
        return; // Don't update if it exceeds 10 digits
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleDateChange = (name, newValue) => {
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      // Convert dayjs objects back to strings before submitting
      const dataToSubmit = { ...formData };
      userFields.forEach(f => {
        if (f.type === 'date' && dataToSubmit[f.name] && dataToSubmit[f.name].format) {
          dataToSubmit[f.name] = dataToSubmit[f.name].format('YYYY-MM-DD');
        }
      });
      onSubmit(dataToSubmit);
      
      // Clear form after submission if NOT editing
      if (!initialData) {
        const emptyData = {};
        userFields.forEach(f => emptyData[f.name] = (f.type === 'date' ? null : ''));
        setFormData(emptyData);
        setErrors({});
        setTouched({});
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {userFields.map((field) => (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                {field.type === 'date' ? (
                  <DatePicker
                    label={field.label}
                    value={formData[field.name] || null}
                    onChange={(newValue) => handleDateChange(field.name, newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: field.required,
                        error: touched[field.name] && !!errors[field.name],
                        helperText: touched[field.name] && errors[field.name],
                        onBlur: () => setTouched(prev => ({ ...prev, [field.name]: true }))
                      },
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[field.name] && !!errors[field.name]}
                    helperText={touched[field.name] && errors[field.name]}
                    variant="outlined"
                    required={field.required}
                    disabled={isLoading}
                    placeholder={field.type === 'date' ? '' : `Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Save size={18} />}
                  size="large"
                  disabled={isLoading}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {isLoading ? 'Saving...' : (initialData ? 'Update User' : 'Add User')}
                </Button>
                {onCancel && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={onCancel}
                    startIcon={<X size={18} />}
                    size="large"
                    disabled={isLoading}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default UserForm;
