import { Home, Users, Clock, Calendar, DollarSign, Settings } from 'lucide-react';

export const navbarLink = [
  {
    title: "Overview",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/human-resources/dashboard",
      },
    ],
  },
  {
    title: "Profiling",
    links: [
      {
        label: "Employee Management",
        icon: Users,
        path: "/human-resources/employee-management",
      },
    ],
  },
  {
    title: "Timekeeping",
    links: [
      {
        label: "Daily Time Records",
        icon: Clock,
        path: "/human-resources/time-keeping",
      },
      {
        label: "Leave Requests",
        icon: Calendar,
        path: "/human-resources/leave-requests",
      },
    ],
  },
  {
    title: "Payroll Processing",
    links: [
      {
        label: "Payroll Processing",
        icon: DollarSign,
        path: "/human-resources/payroll-processing",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Account Settings",
        icon: Settings,
        path: "/human-resources/account-settings",
      },
    ],
  },
];
