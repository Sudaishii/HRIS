import React, { useState, useEffect } from "react";
import { Search, FileText, Loader2, X } from "lucide-react";
import { supabase } from "../../services/supabase-client";
import Toast from "../Toast";
import "../../styles/PayrollProcessing.css";

const PayrollProcessing = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch payslip reports from database
  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payslip_reports")
        .select(`
          *,
          employee:emp_id (
            emp_id,
            emp_fname,
            emp_middle,
            emp_lname,
            emp_email,
            emp_dept,
            position_table:emp_position (
              emp_position
            )
          ),
          payslip_status:payslip_status_id (
            pay_status_id,
            status_name
          )
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching payslip reports:", error);
      showToast("Failed to fetch payslip reports", "error");
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription and initial fetch
  useEffect(() => {
    fetchReports();

    // Set up realtime subscription for payslip_reports table
    const channel = supabase
      .channel("payslip-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payslip_reports",
        },
        (payload) => {
          console.log("Payslip reports table changed:", payload);
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter reports based on search query
  const filteredReports = reports.filter((report) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const employee = report.employee;
    if (employee) {
      const fullName = `${employee.emp_fname || ""} ${employee.emp_middle || ""} ${employee.emp_lname || ""}`.toLowerCase();
      const employeeId = employee.emp_id?.toString() || "";
      const email = (employee.emp_email || "").toLowerCase();
      const department = (employee.emp_dept || "").toLowerCase();
      
      return (
        fullName.includes(query) ||
        employeeId.includes(query) ||
        email.includes(query) ||
        department.includes(query) ||
        report.report_id?.toString().includes(query)
      );
    }
    return report.report_id?.toString().includes(query);
  });

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₱0.00";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get employee name
  const getEmployeeName = (report) => {
    if (report.employee) {
      const { emp_fname, emp_middle, emp_lname } = report.employee;
      return `${emp_fname || ""} ${emp_middle || ""} ${emp_lname || ""}`.trim();
    }
    return `Employee ID: ${report.emp_id}`;
  };

  // Get status badge class
  const getStatusBadgeClass = (statusName) => {
    if (!statusName) return "payroll-status-unknown";
    const status = statusName.toLowerCase();
    if (status.includes("paid") || status.includes("completed")) {
      return "payroll-status-paid";
    } else if (status.includes("pending")) {
      return "payroll-status-pending";
    } else if (status.includes("draft")) {
      return "payroll-status-draft";
    }
    return "payroll-status-unknown";
  };

  // Handle row click
  const handleRowClick = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className="payroll-processing">
      <div className="payroll-processing-container">
        <div className="payroll-processing-header">
          <h1 className="payroll-processing-title">Payroll Processing</h1>
        </div>

        {/* Search Section */}
        <div className="payroll-processing-search-section">
          <div className="payroll-processing-search-wrapper">
            <div className="payroll-processing-search-input-wrapper">
              <Search className="payroll-processing-search-icon" />
              <input
                type="text"
                placeholder="Search by employee name, ID, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="payroll-processing-search-input"
              />
            </div>
          </div>
        </div>

        {/* Main Content: Table and Summary */}
        <div className="payroll-processing-content">
          {/* Table Section */}
          <div className="payroll-processing-table-section">
            {loading ? (
              <div className="payroll-processing-loading">
                <Loader2 className="payroll-processing-loading-icon" />
                <p>Loading payslip reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="payroll-processing-empty">
                <FileText className="payroll-processing-empty-icon" />
                <p>No payslip reports found</p>
              </div>
            ) : (
              <div className="payroll-processing-table-wrapper">
                <table className="payroll-processing-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Gross Salary</th>
                      <th>Deductions</th>
                      <th>Net Pay</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.report_id}
                        className={selectedReport?.report_id === report.report_id ? "payroll-processing-row-selected" : ""}
                        onClick={() => handleRowClick(report)}
                      >
                        <td>
                          <div className="payroll-processing-cell-employee">
                            {getEmployeeName(report)}
                          </div>
                        </td>
                        <td>
                          <div className="payroll-processing-cell-text">
                            {formatDate(report.date)}
                          </div>
                        </td>
                        <td>
                          <div className="payroll-processing-cell-amount">
                            {formatCurrency(report.gross_salary)}
                          </div>
                        </td>
                        <td>
                          <div className="payroll-processing-cell-amount">
                            {formatCurrency(report.t_deductions)}
                          </div>
                        </td>
                        <td>
                          <div className="payroll-processing-cell-amount payroll-processing-cell-net">
                            {formatCurrency(report.net_pay)}
                          </div>
                        </td>
                        <td>
                          <span className={`payroll-processing-status-badge ${getStatusBadgeClass(report.payslip_status?.status_name)}`}>
                            {report.payslip_status?.status_name || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Panel */}
          <div className={`payroll-processing-summary-panel ${selectedReport ? "payroll-processing-summary-panel-visible" : ""}`}>
            {selectedReport ? (
              <div className="payroll-processing-summary-content">
                <div className="payroll-processing-summary-header">
                  <h2 className="payroll-processing-summary-title">Payslip Details</h2>
                  <button
                    className="payroll-processing-summary-close"
                    onClick={() => setSelectedReport(null)}
                  >
                    <X />
                  </button>
                </div>

                <div className="payroll-processing-summary-body">
                  {/* Employee Information */}
                  <div className="payroll-processing-summary-section">
                    <h3 className="payroll-processing-summary-section-title">Employee Information</h3>
                    <div className="payroll-processing-summary-grid">
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Name:</span>
                        <span className="payroll-processing-summary-value">
                          {getEmployeeName(selectedReport)}
                        </span>
                      </div>
                      {selectedReport.employee?.emp_email && (
                        <div className="payroll-processing-summary-item">
                          <span className="payroll-processing-summary-label">Email:</span>
                          <span className="payroll-processing-summary-value">
                            {selectedReport.employee.emp_email}
                          </span>
                        </div>
                      )}
                      {selectedReport.employee?.emp_dept && (
                        <div className="payroll-processing-summary-item">
                          <span className="payroll-processing-summary-label">Department:</span>
                          <span className="payroll-processing-summary-value">
                            {selectedReport.employee.emp_dept}
                          </span>
                        </div>
                      )}
                      {selectedReport.employee?.position_table?.emp_position && (
                        <div className="payroll-processing-summary-item">
                          <span className="payroll-processing-summary-label">Position:</span>
                          <span className="payroll-processing-summary-value">
                            {selectedReport.employee.position_table.emp_position}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pay Period */}
                  <div className="payroll-processing-summary-section">
                    <h3 className="payroll-processing-summary-section-title">Pay Period</h3>
                    <div className="payroll-processing-summary-grid">
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Date:</span>
                        <span className="payroll-processing-summary-value">
                          {formatDate(selectedReport.date)}
                        </span>
                      </div>
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Date Generated:</span>
                        <span className="payroll-processing-summary-value">
                          {formatDate(selectedReport.date_generated)}
                        </span>
                      </div>
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Status:</span>
                        <span className={`payroll-processing-summary-value ${getStatusBadgeClass(selectedReport.payslip_status?.status_name)}`}>
                          {selectedReport.payslip_status?.status_name || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="payroll-processing-summary-section">
                    <h3 className="payroll-processing-summary-section-title">Hours</h3>
                    <div className="payroll-processing-summary-grid">
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Total Hours:</span>
                        <span className="payroll-processing-summary-value">
                          {selectedReport.total_hours || 0} hrs
                        </span>
                      </div>
                      <div className="payroll-processing-summary-item">
                        <span className="payroll-processing-summary-label">Overtime Hours:</span>
                        <span className="payroll-processing-summary-value">
                          {selectedReport.total_overtime || 0} hrs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="payroll-processing-summary-section">
                    <h3 className="payroll-processing-summary-section-title">Earnings</h3>
                    <div className="payroll-processing-summary-list">
                      <div className="payroll-processing-summary-list-item">
                        <span className="payroll-processing-summary-list-label">Gross Salary:</span>
                        <span className="payroll-processing-summary-list-value">
                          {formatCurrency(selectedReport.gross_salary)}
                        </span>
                      </div>
                      {selectedReport.overtime_pay > 0 && (
                        <div className="payroll-processing-summary-list-item">
                          <span className="payroll-processing-summary-list-label">Overtime Pay:</span>
                          <span className="payroll-processing-summary-list-value">
                            {formatCurrency(selectedReport.overtime_pay)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="payroll-processing-summary-section">
                    <h3 className="payroll-processing-summary-section-title">Deductions</h3>
                    <div className="payroll-processing-summary-list">
                      <div className="payroll-processing-summary-list-item">
                        <span className="payroll-processing-summary-list-label">SSS:</span>
                        <span className="payroll-processing-summary-list-value payroll-processing-summary-deduction">
                          {formatCurrency(selectedReport.sss)}
                        </span>
                      </div>
                      <div className="payroll-processing-summary-list-item">
                        <span className="payroll-processing-summary-list-label">PhilHealth:</span>
                        <span className="payroll-processing-summary-list-value payroll-processing-summary-deduction">
                          {formatCurrency(selectedReport.phil_health)}
                        </span>
                      </div>
                      <div className="payroll-processing-summary-list-item">
                        <span className="payroll-processing-summary-list-label">Pag-IBIG:</span>
                        <span className="payroll-processing-summary-list-value payroll-processing-summary-deduction">
                          {formatCurrency(selectedReport.pag_ibig)}
                        </span>
                      </div>
                      <div className="payroll-processing-summary-list-item payroll-processing-summary-list-item-total">
                        <span className="payroll-processing-summary-list-label">Total Deductions:</span>
                        <span className="payroll-processing-summary-list-value payroll-processing-summary-deduction">
                          {formatCurrency(selectedReport.t_deductions)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="payroll-processing-summary-section payroll-processing-summary-section-net">
                    <div className="payroll-processing-summary-net">
                      <span className="payroll-processing-summary-net-label">Net Pay:</span>
                      <span className="payroll-processing-summary-net-value">
                        {formatCurrency(selectedReport.net_pay)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="payroll-processing-summary-empty">
                <FileText className="payroll-processing-summary-empty-icon" />
                <p>Select a payslip report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          isOpen={toast.show}
          onClose={() => setToast({ show: false, message: "", type: "" })}
          message={toast.message}
          variant={toast.type}
        />
      )}
    </div>
  );
};

export default PayrollProcessing;
