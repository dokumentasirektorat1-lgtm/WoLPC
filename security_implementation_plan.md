# Implementation Plan - Secure NyalakanPC Dashboard

This plan outlines the steps to add security, authentication, and authorization to the NyalakanPC project, enabling safe deployment to Vercel.

## 1. Backend Setup (Supabase)
We will use Supabase as the backend for Authentication and Database.
- **Project Setup**: Create a new project in Supabase.
- **Database Tables**:
    - `profiles`: Stores user roles and approval status.
    - `devices`: Stores MAC addresses and device names.
    - `user_devices`: Mapping table to link users to specific devices.
- **Row Level Security (RLS)**: Ensure users can only read devices they are assigned to.

## 2. Frontend Updates
The React dashboard will be updated to include:
- **Authentication Pages**: Login and Register.
- **Protected Routes**: Ensure only logged-in users can access the dashboard.
- **Approval System**: New users are "pending" until an admin approves them.
- **Role-Based UI**:
    - **Admin Dashboard**: Manage users, approve accounts, add/remove devices, and assign devices to users.
    - **User Dashboard**: List of assigned devices with "Wake" buttons.
- **State Management**: Using Supabase Auth state.

## 3. Security Hardening
- **MQTT Isolation**: Commands will only be sent from the frontend after verifying database permissions.
- **Environment Variables**: Move MQTT broker URL and Supabase credentials to `.env`.

## 4. Deployment to Vercel
- **Build Optimization**: Ensure the project builds correctly.
- **Env Config**: Set up Supabase and MQTT variables in Vercel dashboard.

## 5. ESP-01 Compatibility
- **No changes required**: The ESP-01 will continue to listen to the same MQTT topics. Since the commands are now gated by the authenticated dashboard, only authorized users can trigger the wake signal.

---

### Next Steps:
1. Install `@supabase/supabase-js`, `react-router-dom`, and `framer-motion`.
2. Create Supabase client configuration.
3. Implement Login/Register UI.
4. Refactor `App.jsx` into components (Auth, Dashboard, Admin).
