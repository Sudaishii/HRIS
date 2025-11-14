import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const DashboardHR = () => {
  const team = [
    { name: "Emmeline Labrie", email: "emmeline.labrie@example.com" },
    { name: "Zac Wight", email: "zac.wight@example.com" },
    { name: "Poppy Nicholls", email: "poppy.nicholls@example.com" },
    { name: "Da-Xia Wu", email: "da-xia.wu@example.com" },
    { name: "Marisa Palermo", email: "marisa.palermo@example.com" },
  ];

  const containerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "720px",
    margin: "40px auto 24px",
    padding: "clamp(16px, 4vw, 24px)",
    backgroundColor: "#1f1f2b",
    color: "#f5f5f5",
    borderRadius: "8px",
    fontFamily: "system-ui, sans-serif",
  };

const cardWrapper = {
  display: "grid",
  marginTop: "40px",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
  gap: "clamp(16px, 3vw, 20px)",
  marginBottom: "24px",
  width: "100%",
  maxWidth: "1300px",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "0 clamp(16px, 4vw, 24px)",
};

// 👇 Bigger card style
const cardStyle = {
  backgroundColor: "#2b2b3b",
  borderRadius: "12px",
  padding: "clamp(20px, 4vw, 36px) clamp(16px, 3vw, 30px)",
  minHeight: "160px",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
};


  const inputRow = {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const inputStyle = {
    flex: 1,
    border: "none",
    outline: "none",
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "14px",
    color: "#f5f5f5",
    backgroundColor: "#2b2b3b",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const memberCard = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2b2b3b",
    borderRadius: "6px",
    padding: "clamp(8px, 2vw, 12px)",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "8px",
  };

  const memberInfo = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const avatarStyle = {
    display: "inline-flex",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#3a3a4d",
  };

  const nameStyle = {
    color: "#60a5fa",
    fontWeight: 500,
    fontSize: "clamp(12px, 1.8vw, 14px)",
    marginBottom: "2px",
    cursor: "pointer",
    wordBreak: "break-word",
  };

  const emailStyle = {
    color: "#aaa",
    fontSize: "clamp(11px, 1.6vw, 13px)",
    wordBreak: "break-word",
  };

  const moreButton = {
    color: "#aaa",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px",
  };

  return (
    <>
      {/* KPI Cards Section */}
      <div style={cardWrapper}>
        <div style={cardStyle}></div>
        <div style={cardStyle}></div>
        <div style={cardStyle}></div>
        <div style={cardStyle}></div>
      </div>

      {/* Employees Section */}
      <div style={containerStyle}>
        <h2 style={{ fontSize: "clamp(16px, 2.5vw, 18px)", fontWeight: 600, marginBottom: "4px" }}>Employees</h2>
        <p style={{ fontSize: "clamp(12px, 1.8vw, 13px)", color: "#aaa", marginBottom: "16px" }}>
          Invite new employees to the company.
        </p>

        <div style={inputRow}>
          <input type="email" placeholder="Email address" style={inputStyle} />
          <button style={buttonStyle}>Invite</button>
        </div>

        {team.map((member) => (
          <div key={member.email} style={memberCard}>
            <div style={memberInfo}>
              <Avatar.Root style={avatarStyle}>
                <Avatar.Image
                  src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(
                    member.name
                  )}`}
                  alt={member.name}
                />
                <Avatar.Fallback
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color: "#ccc",
                    fontSize: "13px",
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar.Fallback>
              </Avatar.Root>

              <div>
                <div style={nameStyle}>{member.name}</div>
                <div style={emailStyle}>{member.email}</div>
              </div>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button style={moreButton}>⋮</button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                style={{
                  backgroundColor: "#2b2b3b",
                  borderRadius: "6px",
                  padding: "4px",
                  fontSize: "13px",
                  color: "#f5f5f5",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
                align="end"
              >
                <DropdownMenu.Item
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "#f87171",
                  }}
                >
                  Remove
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardHR;
