import { Home, Users, Clock, Calendar, DollarSign } from 'lucide-react';

export const navbarLink = [
  {
    title: "Overview",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/human-resources",
      },
    ],
  },
  {
    title: "Profiling",
    links: [
      {
        label: "Employee Management",
        icon: Users,
        path: "employee-management",
      },
    ],
  },
  {
    title: "Timekeeping",
    links: [
      {
        label: "Daily Time Records",
        icon: Clock,
        path: "/time-keeping",
      },
      {
        label: "Leave Requests",
        icon: Calendar,
        path: "/leave-requests",
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
        icon: Users,
        path: "/account-settings",
      },
    ],
  },
];
