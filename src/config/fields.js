export const userFields = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    validation: (value) => {
      if (!value) return 'First name is required';
      if (value.length < 2) return 'First name must be at least 2 characters';
      if (/[0-9]/.test(value)) return 'First name should not contain numbers';
      return true;
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    validation: (value) => {
      if (!value) return 'Last name is required';
      if (value.length < 2) return 'Last name must be at least 2 characters';
      if (/[0-9]/.test(value)) return 'Last name should not contain numbers';
      return true;
    },
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: (value) => {
      if (!value) return 'Email is required';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address (e.g. name@example.com)';
    }
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    validation: (value) => {
      if (!value) return 'Phone number is required';
      if (!/^\d+$/.test(value)) return 'Phone number must contain only digits';
      return /^\d{10}$/.test(value) || 'Phone number must be exactly 10 digits';
    }
  },
  {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    required: true,
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: false,
    fullWidth: true,
  },
];
