import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  IconButton, 
  Alert, 
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Stack,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  Users, 
  UserPlus, 
  RefreshCw, 
  Moon, 
  Sun,
  AlertTriangle
} from 'lucide-react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { getUsers, createUser, updateUser, deleteUser } from './services/userService';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('light');
  
  // Feedback states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });

  // Create a custom Material UI theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#6366f1' },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 800 },
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  }), [mode]);

  useEffect(() => {
    fetchUsers();
    const savedTheme = localStorage.getItem('theme') || 'light';
    setMode(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = mode === 'light' ? 'dark' : 'light';
    setMode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const showFeedback = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError('Could not connect to the API. Use: npx json-server --watch db.json --port 3001');
      showFeedback('API Connection Failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdate = async (formData) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        showFeedback('User updated successfully!');
      } else {
        await createUser(formData);
        showFeedback('User registered successfully!');
      }
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      showFeedback('Error saving user data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteDialog({ open: true, userId: id });
  };

  const handleDelete = async () => {
    const id = deleteDialog.userId;
    setDeleteDialog({ open: false, userId: null });
    setIsLoading(true);
    try {
      await deleteUser(id);
      showFeedback('User deleted successfully');
      await fetchUsers();
    } catch (err) {
      showFeedback('Failed to delete user.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoading && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 2000,
            height: 4
          }} 
        />
      )}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 0.5 }}>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Professional CRUD with Dynamic Schema Architecture
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ border: '1px solid', borderColor: 'divider' }}>
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </IconButton>
            <IconButton onClick={fetchUsers} disabled={isLoading} color="inherit" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </IconButton>
          </Stack>
        </Box>

        {error && (
          <Alert severity="warning" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={4}>
          <Paper elevation={mode === 'light' ? 2 : 0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: mode === 'light' ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserPlus size={20} color={theme.palette.primary.main} />
                <Typography variant="h6">
                  {editingUser ? 'Edit User Profile' : 'Register New User'}
                </Typography>
              </Box>
              {editingUser && (
                <Chip 
                  label="Editing Mode" 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                  onDelete={() => setEditingUser(null)}
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
            <Divider />
            <Box sx={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto', transition: '0.2s' }}>
              <UserForm 
                onSubmit={handleAddOrUpdate} 
                initialData={editingUser} 
                onCancel={editingUser ? () => setEditingUser(null) : null}
                isLoading={isLoading}
              />
            </Box>
          </Paper>

          <Paper elevation={mode === 'light' ? 2 : 0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Users size={20} color={theme.palette.primary.main} />
                <Typography variant="h6">Database Registry</Typography>
              </Stack>
              {isLoading && <CircularProgress size={20} />}
            </Box>
            <UserList 
              users={users} 
              onEdit={setEditingUser} 
              onDelete={confirmDelete} 
            />
          </Paper>
        </Stack>

        {/* Feedback Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, userId: null })}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle color="#ef4444" /> Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to permanently remove this user? This action cannot be undone.
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained" disabled={isLoading}>Delete Forever</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 8, pb: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            v1.2.0 • Senior Implementation Registry • Built with Architecture in Mind
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
