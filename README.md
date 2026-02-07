# User Management System

This is a React-based CRUD application designed to manage user data with a focus on simplicity and maintainability. It uses Material UI for the interface and a schema-driven approach for form building.

## Core Features

### Dynamic Form Architecture
The application uses a central configuration file located at `src/config/fields.js`. This allows the form and the data table to update automatically whenever a new field is added to the configuration.

### Validation and Feedback
- Inputs are validated as you type and when you leave a field.
- Clear error messages help guide proper data entry.
- Success notifications appear after every action to confirm the data was saved or deleted.

### User Experience
- Includes a confirmation step before deleting any user to prevent accidents.
- Visual loading indicators show when the app is talking to the database.
- Supports both light and dark modes based on user preference.

## Technical Details

- **Frontend**: React 18 with Vite.
- **UI Library**: Material UI.
- **State and API**: Axios for requests and standard React hooks for state.
- **Mock Service**: JSON Server provides a local database for testing.

## Getting Started

### 1. Install Dependencies
Run the following command to download the required packages:
```bash
npm install
```

### 2. Start the Local API
Open a terminal and start the database server on port 3001:
```bash
npx json-server --watch db.json --port 3001
```

### 3. Start the Development Server
In a second terminal, start the React application:
```bash
npm run dev
```

## Adding New Fields

To add a new field, such as an Address or Department, open `src/config/fields.js` and add a new object to the array. For example:

```javascript
{
  name: 'address',
  label: 'Home Address',
  type: 'text',
  required: true,
  fullWidth: true,
  validation: (value) => value.length > 5 || 'Please enter a more detailed address'
}
```

The application will handle everything else, including adding the new input to the form and a new column to the table.

## Design Assumptions

- Port 3001 was chosen for the API to avoid common conflicts with other local tools.
- Validation logic is kept inside the configuration file to keep the component code clean and easy to follow.
- Material UI was selected to provide a professional and consistent UI without writing excessive custom CSS.
