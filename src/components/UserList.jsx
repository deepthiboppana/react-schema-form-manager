import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Chip
} from '@mui/material';
import { Edit2, Trash2, Mail, Phone, User } from 'lucide-react';
import { userFields } from '../config/fields';

const UserList = ({ users, onEdit, onDelete }) => {
  const getIcon = (fieldName) => {
    switch (fieldName) {
      case 'email': return <Mail size={14} color="gray" />;
      case 'phone': return <Phone size={14} color="gray" />;
      default: return <User size={14} color="gray" />;
    }
  };

  const formatValue = (value, fieldType) => {
    if (!value) return '-';
    if (fieldType === 'date') return new Date(value).toLocaleDateString();
    return value;
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {userFields.map(field => (
              <TableCell key={field.name} sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {field.label.toUpperCase()}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(users) && users.map((user) => (
            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {userFields.map(field => (
                <TableCell key={field.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getIcon(field.name)}
                    <Typography variant="body2" sx={{ fontWeight: field.name === 'firstName' ? 600 : 400 }}>
                      {formatValue(user[field.name], field.type)}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit User">
                    <IconButton 
                      onClick={() => onEdit(user)} 
                      color="primary"
                      size="small"
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <Edit2 size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton 
                      onClick={() => onDelete(user.id)} 
                      color="error"
                      size="small"
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {(!users || users.length === 0) && (
            <TableRow>
              <TableCell colSpan={userFields.length + 1} align="center" sx={{ py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  No users found. Add your first user above!
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
