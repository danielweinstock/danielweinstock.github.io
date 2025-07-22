// Replace the problematic demo section (around lines 900-950) with this corrected version:

setTimeout(function() {
  const demoDashboard = {
    userPayload: demoData,
    dispatch: {
      ASSIGNED: {
        tech1: {
          job1: {
            jobNumber: "12345",
            jobStartDate: "2025-07-10",
            startMin: 540,
            customerName: "ABC Beverage Co",
            city_state: "Boston, MA",
            postal_code: "02101",
            job_category: "Installation",
            jobStatusName: "Scheduled"
          },
          job2: {
            jobNumber: "12346",
            jobStartDate: "2025-07-10",
            startMin: 720,
            customerName: "XYZ Restaurant",
            city_state: "Springfield, MA",
            postal_code: "01103",
            job_category: "Maintenance",
            jobStatusName: "Confirmed"
          }
        }
      }
    },
    parts_transfer: [
      {
        transfer_id: "pt1",
        description: "CO2 Regulator - Model XR500",
        job_number: "12345",
        notes: "Required for installation tomorrow"
      }
    ],
    messages: [
      {
        messageId: "msg1",
        message_text: "Remember to check equipment before departure"
      }
    ]
  };
  
  // Test no data scenario: Comment out the above demoDashboard and uncomment below
  // const demoDashboardNoData = {
  //   userPayload: demoData,
  //   dispatch: { ASSIGNED: {} },
  //   parts_transfer: [],
  //   messages: []
  // };
  
  // Check if user has no data at all (no jobs, no parts, no messages)
  if (hasNoDataAtAll(demoDashboard)) {
    console.log('Demo: User has no data at all, staying on welcome screen for 8 seconds');
    setTimeout(fadeOutAndShowIdle, 8000); // 8 second timeout with fade out
  } else {
    renderDashboard(demoDashboard, 30000);
  }
}, 1500);
