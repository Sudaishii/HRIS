import React, { useState, useEffect } from "react";
import { FileText, Clock, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { supabase } from "../../services/supabase-client";
import * as Dialog from "@radix-ui/react-dialog";
import Toast from "../Toast";
import "../../styles/DashboardEmployee.css";

export const DashboardEmployee = () => {
  const [kpiData, setKpiData] = useState({
    totalPayslips: 0,
    totalDTR: 0,
    pendingLeaves: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [empId, setEmpId] = useState(null);
  const [showBindDialog, setShowBindDialog] = useState(false);
  const [bindEmpId, setBindEmpId] = useState("");
  const [binding, setBinding] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [userSession, setUserSession] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const user = JSON.parse(session);
      setUserSession(user);
      setEmpId(user.emp_id);
      
      if (!user.emp_id) {
        setShowBindDialog(true);
      } else {
        fetchKPIData(user.emp_id);
        fetchEmployeeName(user.emp_id);
      }
    }
  }, []);

  const fetchEmployeeName = async (employeeId) => {
    if (!employeeId) return;
    
    try {
      const { data, error } = await supabase
        .from("employee")
        .select("emp_fname, emp_middle, emp_lname")
        .eq("emp_id", employeeId)
        .single();

      if (error) throw error;
      
      if (data) {
        const fullName = `${data.emp_fname || ""} ${data.emp_middle || ""} ${data.emp_lname || ""}`.trim();
        setEmployeeName(fullName || "Employee");
      }
    } catch (error) {
      setEmployeeName("Employee");
    }
  };

  const fetchKPIData = async (employeeId) => {
    if (!employeeId) return;
    
    try {
      setLoading(true);
      
      // Fetch total payslips
      const { count: payslipCount } = await supabase
        .from("payslip_reports")
        .select("*", { count: "exact", head: true })
        .eq("emp_id", employeeId);

      // Fetch total DTR records
      const { count: dtrCount } = await supabase
        .from("daily_time_record")
        .select("*", { count: "exact", head: true })
        .eq("employee_id", employeeId);

      // Fetch pending leave requests
      const { count: pendingLeavesCount } = await supabase
        .from("leavereq_table")
        .select("*", { count: "exact", head: true })
        .eq("employee_id", employeeId)
        .eq("leave_status", "Pending");

      // Fetch total earnings (sum of net_pay from payslip_reports)
      const { data: payrollData } = await supabase
        .from("payslip_reports")
        .select("net_pay")
        .eq("emp_id", employeeId);

      const totalEarnings = payrollData?.reduce((sum, report) => {
        return sum + (parseFloat(report.net_pay) || 0);
      }, 0) || 0;

      setKpiData({
        totalPayslips: payslipCount || 0,
        totalDTR: dtrCount || 0,
        pendingLeaves: pendingLeavesCount || 0,
        totalEarnings: totalEarnings,
      });
    } catch (error) {
      // Error fetching KPI data
    } finally {
      setLoading(false);
    }
  };

  const handleBindEmployeeId = async () => {
    if (!bindEmpId.trim()) {
      showToast("Please enter an Employee ID", "error");
      return;
    }

    setBinding(true);
    try {
      // Verify employee exists
      const { data: employee, error: empError } = await supabase
        .from("employee")
        .select("emp_id")
        .eq("emp_id", parseInt(bindEmpId))
        .single();

      if (empError || !employee) {
        showToast("Employee ID not found. Please check and try again.", "error");
        setBinding(false);
        return;
      }

      // Update user's emp_id in database
      if (userSession && userSession.id) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ emp_id: parseInt(bindEmpId) })
          .eq("id", userSession.id);

        if (updateError) throw updateError;

        // Update local session
        const updatedSession = {
          ...userSession,
          emp_id: parseInt(bindEmpId),
        };
        localStorage.setItem("userSession", JSON.stringify(updatedSession));
        setUserSession(updatedSession);
        setEmpId(parseInt(bindEmpId));
        setShowBindDialog(false);
        setBindEmpId("");
        showToast("Employee ID bound successfully!", "success");
        
        // Fetch KPI data and employee name with new emp_id
        fetchKPIData(parseInt(bindEmpId));
        fetchEmployeeName(parseInt(bindEmpId));
      }
    } catch (error) {
      showToast("Failed to bind Employee ID. Please try again.", "error");
    } finally {
      setBinding(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: "Total Payslips",
      value: loading ? "..." : kpiData.totalPayslips.toString(),
      icon: FileText,
      color: "#3b82f6",
    },
    {
      title: "Daily Time Records",
      value: loading ? "..." : kpiData.totalDTR.toString(),
      icon: Clock,
      color: "#10b981",
    },
    {
      title: "Pending Leaves",
      value: loading ? "..." : kpiData.pendingLeaves.toString(),
      icon: Calendar,
      color: "#f59e0b",
    },
    {
      title: "Total Earnings",
      value: loading ? "..." : formatCurrency(kpiData.totalEarnings),
      icon: DollarSign,
      color: "#8b5cf6",
    },
  ];

  const getEmployeeName = () => {
    if (employeeName) {
      return employeeName;
    }
    return "Employee";
  };

  return (
    <div className="dashboard-employee-container">
      {/* Welcome Section */}
      <div className="dashboard-employee-welcome">
        <h2 className="dashboard-employee-welcome-title">
          Welcome back, {getEmployeeName()}!
        </h2>
        <p className="dashboard-employee-welcome-subtitle">
          Here's an overview of your records and activities. Manage your payslips, time records, and leave requests all in one place.
        </p>
      </div>

      {/* Bind Employee ID Dialog */}
      <Dialog.Root open={showBindDialog} onOpenChange={setShowBindDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="dashboard-employee-bind-dialog-overlay" />
          <Dialog.Content className="dashboard-employee-bind-dialog-content">
            <Dialog.Title className="dashboard-employee-bind-dialog-title">
              <AlertCircle size={24} color="#f59e0b" />
              Bind Employee ID
            </Dialog.Title>
            <Dialog.Description className="dashboard-employee-bind-dialog-description">
              Please enter your Employee ID to access all features. This will link your account to your employee profile.
            </Dialog.Description>
            <input
              type="number"
              placeholder="Enter Employee ID"
              value={bindEmpId}
              onChange={(e) => setBindEmpId(e.target.value)}
              className="dashboard-employee-bind-input"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleBindEmployeeId();
                }
              }}
            />
            <div className="dashboard-employee-bind-actions">
              <button
                onClick={() => {
                  localStorage.removeItem('userSession');
                  window.location.href = '/login';
                }}
                className="dashboard-employee-bind-logout-button"
              >
                Logout
              </button>
              <button
                onClick={handleBindEmployeeId}
                disabled={binding || !bindEmpId.trim()}
                className="dashboard-employee-bind-button"
              >
                {binding ? "Binding..." : "Bind ID"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Warning Message if no emp_id */}
      {!empId && (
        <div className="dashboard-employee-warning-banner">
          <AlertCircle size={24} />
          <div className="dashboard-employee-warning-content">
            <p className="dashboard-employee-warning-title">
              Employee ID Required
            </p>
            <p className="dashboard-employee-warning-text">
              Please bind your Employee ID to access all features. Click the button below to get started.
            </p>
          </div>
          <button
            onClick={() => setShowBindDialog(true)}
            className="dashboard-employee-warning-button"
          >
            Bind Employee ID
          </button>
        </div>
      )}

      {/* KPI Cards Section */}
      <div className="dashboard-employee-kpi-grid">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`dashboard-employee-kpi-card ${!empId ? 'disabled' : ''}`}
              style={{
                borderTop: `4px solid ${card.color}`
              }}
            >
              <div className="dashboard-employee-kpi-header">
                <div className="dashboard-employee-kpi-icon-wrapper" style={{ background: card.color }}>
                  <Icon size={24} color="white" />
                </div>
                <h3 className="dashboard-employee-kpi-title">
                  {card.title}
                </h3>
              </div>
              <p className="dashboard-employee-kpi-value">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        variant={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "" })}
      />
    </div>
  );
};

export default DashboardEmployee;

