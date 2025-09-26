import React from "react";

import Script from "dangerous-html/react";
import { Helmet } from "react-helmet";

import Navigation from "../components/navigation";
import Footer from "../components/footer";
import "./truck-scheduling.css";

const TruckScheduling = (props) => {
  return (
    <div className="truck-scheduling-container1">
      <Helmet>
        <title>Truck-Scheduling - WasteWise</title>
        <meta property="og:title" content="Truck-Scheduling - WasteWise" />
      </Helmet>
      <Navigation></Navigation>
      <div className="truck-scheduling-container2">
        <div className="truck-scheduling-container3">
          <Script
            html={`<style>
        @keyframes pulse {0% {opacity: 1;}
50% {opacity: 0.5;}
100% {opacity: 1;}}
        </style> `}
          ></Script>
        </div>
      </div>
      <div className="truck-scheduling-container4">
        <div className="truck-scheduling-container5">
          <Script
            html={`<script defer data-name="truck-scheduling-interactions">
(function(){
  // Calendar interaction handlers
  function initializeCalendarInteractions() {
    const scheduleSlots = document.querySelectorAll(".schedule-slot.available")

    scheduleSlots.forEach((slot) => {
      slot.addEventListener("click", function () {
        const modal = createAssignmentModal()
        document.body.appendChild(modal)
        modal.style.display = "flex"
      })
    })
  }

  // Truck list interaction handlers
  function initializeTruckListInteractions() {
    const assignButtons = document.querySelectorAll(".truck-item .btn-primary")

    assignButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const truckItem = this.closest(".truck-item")
        const truckId = truckItem.querySelector(".truck-id-primary").textContent
        showAssignmentConfirmation(truckId)
      })
    })

    const trackButtons = document.querySelectorAll(".truck-item .btn-secondary")
    trackButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const truckItem = this.closest(".truck-item")
        const truckId = truckItem.querySelector(".truck-id-primary").textContent
        showTrackingView(truckId)
      })
    })
  }

  // Route optimization interactions
  function initializeRouteInteractions() {
    const routeMarkers = document.querySelectorAll(".marker")

    routeMarkers.forEach((marker) => {
      marker.addEventListener("click", function () {
        const binId = this.querySelector(".marker-id").textContent
        const fillLevel = this.querySelector(".fill-level").textContent
        showBinDetails(binId, fillLevel)
      })
    })

    const assignRouteBtn = document.querySelector(".route-actions .btn-primary")
    if (assignRouteBtn) {
      assignRouteBtn.addEventListener("click", function () {
        showRouteAssignmentModal()
      })
    }
  }

  // Alert interactions
  function initializeAlertInteractions() {
    const alertItems = document.querySelectorAll(".alert-item")

    alertItems.forEach((item) => {
      item.addEventListener("click", function () {
        this.classList.toggle("expanded")
        showAlertDetails(this)
      })
    })

    const notificationActions = document.querySelectorAll(
      ".notification-actions .btn"
    )
    notificationActions.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
        const action = this.textContent.trim()
        const notification = this.closest(".notification-item")
        handleNotificationAction(notification, action)
      })
    })
  }

  // Live tracker updates
  function initializeLiveTrackerUpdates() {
    const liveIndicators = document.querySelectorAll(".live-indicator")

    // Simulate live updates
    setInterval(() => {
      updateTruckStatuses()
      updateAlertCounts()
      updateMetrics()
    }, 5000)
  }

  // Filter interactions
  function initializeFilterInteractions() {
    const filterCheckboxes = document.querySelectorAll(".filter-checkbox input")

    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        filterNotifications()
      })
    })

    const exportButtons = document.querySelectorAll(".export-buttons .btn")
    exportButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const exportType = this.textContent.includes("CSV") ? "csv" : "pdf"
        exportData(exportType)
      })
    })
  }

  // Utility functions
  function createAssignmentModal() {
    const modal = document.createElement("div")
    modal.className = "assignment-modal"
    modal.innerHTML = \`
    <div class="modal-content">
      <h3>Assign Truck to Time Slot</h3>
      <div class="assignment-form">
        <select class="truck-selector">
          <option value="">Select Truck</option>
          <option value="T-401">T-401 - Mike Rodriguez</option>
          <option value="T-302">T-302 - Lisa Park</option>
        </select>
        <select class="route-selector">
          <option value="">Select Route</option>
          <option value="Route-A">Route A</option>
          <option value="Route-B">Route B</option>
          <option value="Route-C">Route C</option>
        </select>
        <div class="modal-actions">
          <button class="btn btn-primary">Assign</button>
          <button class="btn btn-secondary modal-close">Cancel</button>
        </div>
      </div>
    </div>
  \`

    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.remove()
    })

    return modal
  }

  function showAssignmentConfirmation(truckId) {
    const confirmation = document.createElement("div")
    confirmation.className = "toast-notification success"
    confirmation.textContent = \`\${truckId} assignment confirmed\`
    document.body.appendChild(confirmation)

    setTimeout(() => {
      confirmation.remove()
    }, 3000)
  }

  function showTrackingView(truckId) {
    // Simulate opening tracking view
    const trackingPanel = document.createElement("div")
    trackingPanel.className = "tracking-panel"
    trackingPanel.innerHTML = \`
    <div class="tracking-header">
      <h4>Tracking: \${truckId}</h4>
      <button class="close-tracking">×</button>
    </div>
    <div class="tracking-content">
      <p>Current Location: Downtown District</p>
      <p>Next Stop: Bin #247</p>
      <p>ETA: 14:30</p>
    </div>
  \`

    document.body.appendChild(trackingPanel)

    trackingPanel
      .querySelector(".close-tracking")
      .addEventListener("click", () => {
        trackingPanel.remove()
      })
  }

  function showBinDetails(binId, fillLevel) {
    const details = document.createElement("div")
    details.className = "bin-details-popup"
    details.innerHTML = \`
    <div class="popup-content">
      <h4>Bin Details: \${binId}</h4>
      <p>Fill Level: \${fillLevel}</p>
      <p>Last Update: 2 minutes ago</p>
      <p>Location: Downtown District</p>
      <button class="btn btn-primary">Schedule Pickup</button>
    </div>
  \`

    document.body.appendChild(details)

    setTimeout(() => {
      details.remove()
    }, 4000)
  }

  function showRouteAssignmentModal() {
    const modal = document.createElement("div")
    modal.className = "route-assignment-modal"
    modal.innerHTML = \`
    <div class="modal-content">
      <h3>Assign Optimized Route</h3>
      <p>Assign this route to an available truck?</p>
      <div class="modal-actions">
        <button class="btn btn-primary">Confirm Assignment</button>
        <button class="btn btn-secondary modal-close">Cancel</button>
      </div>
    </div>
  \`

    document.body.appendChild(modal)

    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.remove()
    })
  }

  function showAlertDetails(alertItem) {
    const alertTitle = alertItem.querySelector(".alert-title").textContent
    const details = document.createElement("div")
    details.className = "alert-details-expanded"
    details.innerHTML = \`
    <div class="expanded-content">
      <h4>\${alertTitle}</h4>
      <p>Additional details and recommended actions would appear here.</p>
    </div>
  \`

    if (!alertItem.querySelector(".alert-details-expanded")) {
      alertItem.appendChild(details)
    }
  }

  function handleNotificationAction(notification, action) {
    const notificationTitle = notification.querySelector(
      ".notification-title"
    ).textContent

    const toast = document.createElement("div")
    toast.className = "toast-notification"
    toast.textContent = \`\${action} action performed for: \${notificationTitle}\`
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 3000)

    // Simulate removing notification after action
    if (action === "Dispatch Now" || action === "Acknowledge") {
      setTimeout(() => {
        notification.style.opacity = "0.5"
      }, 1000)
    }
  }

  function updateTruckStatuses() {
    const statusBadges = document.querySelectorAll(".status-badge")
    // Simulate occasional status changes
    statusBadges.forEach((badge) => {
      if (Math.random() > 0.95) {
        badge.style.animation = "pulse 1s ease-in-out"
        setTimeout(() => {
          badge.style.animation = ""
        }, 1000)
      }
    })
  }

  function updateAlertCounts() {
    const alertCount = document.querySelector(".alert-count")
    if (alertCount && Math.random() > 0.9) {
      const currentCount = parseInt(alertCount.textContent.split(" ")[0])
      alertCount.textContent = \`\${currentCount + 1} Active\`
    }
  }

  function updateMetrics() {
    const progressBars = document.querySelectorAll(".progress-fill")
    progressBars.forEach((bar) => {
      const currentWidth = parseInt(bar.style.width)
      const variation = Math.random() * 4 - 2 // ±2%
      const newWidth = Math.max(0, Math.min(100, currentWidth + variation))
      bar.style.width = \`\${newWidth}%\`
    })
  }

  function filterNotifications() {
    const checkboxes = document.querySelectorAll(".filter-checkbox input")
    const notifications = document.querySelectorAll(".notification-item")

    const activeFilters = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.parentElement.textContent.trim().toLowerCase())

    notifications.forEach((notification) => {
      const notificationClasses = notification.className.toLowerCase()
      const shouldShow = activeFilters.some(
        (filter) =>
          notificationClasses.includes(filter.split(" ")[0]) ||
          filter === "success confirmations"
      )

      notification.style.display = shouldShow ? "grid" : "none"
    })
  }

  function exportData(type) {
    const toast = document.createElement("div")
    toast.className = "toast-notification success"
    toast.textContent = \`Exporting data as \${type.toUpperCase()}...\`
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.textContent = \`\${type.toUpperCase()} export completed!\`
      setTimeout(() => {
        toast.remove()
      }, 2000)
    }, 1500)
  }

  // Initialize all interactions when page loads
  initializeCalendarInteractions()
  initializeTruckListInteractions()
  initializeRouteInteractions()
  initializeAlertInteractions()
  initializeLiveTrackerUpdates()
  initializeFilterInteractions()

  // Add responsive menu toggle for mobile
  const menuToggle = document.createElement("button")
  menuToggle.className = "mobile-menu-toggle"
  menuToggle.innerHTML = "☰"
  menuToggle.style.display = "none"

  // Show/hide mobile menu toggle based on screen size
  function checkMobileMenu() {
    if (window.innerWidth <= 767) {
      menuToggle.style.display = "block"
    } else {
      menuToggle.style.display = "none"
    }
  }

  window.addEventListener("resize", checkMobileMenu)
  checkMobileMenu()
})()
</script>`}
          ></Script>
        </div>
      </div>
      <main className="truck-scheduling-page">
        <section id="calendar-truck-list" className="calendar-truck-section">
          <div className="calendar-truck-container">
            <div className="section-header">
              <h1 className="hero-title">Truck Scheduling</h1>
              <p className="section-subtitle">
                {" "}
                Assign with confidence using intelligent scheduling and
                real-time fleet oversight
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="calendar-truck-layout">
              <div className="calendar-container">
                <div className="calendar-header">
                  <div className="calendar-title-group">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M8 2v4m8-4v4"></path>
                        <rect x="3" y="4" rx="2" width="18" height="18"></rect>
                        <path d="M3 10h18"></path>
                      </g>
                    </svg>
                    <h2 className="section-title">Weekly Schedule</h2>
                  </div>
                  <div className="calendar-controls">
                    <button className="btn-secondary btn">Previous</button>
                    <span className="current-week">Nov 18-24, 2025</span>
                    <button className="btn-secondary btn">Next</button>
                  </div>
                </div>
                <div className="calendar-grid">
                  <div className="time-column">
                    <div className="time-header">
                      <span>Time</span>
                    </div>
                    <div className="time-slot">
                      <span>06:00</span>
                    </div>
                    <div className="time-slot">
                      <span>08:00</span>
                    </div>
                    <div className="time-slot">
                      <span>10:00</span>
                    </div>
                    <div className="time-slot">
                      <span>12:00</span>
                    </div>
                    <div className="time-slot">
                      <span>14:00</span>
                    </div>
                    <div className="time-slot">
                      <span>16:00</span>
                    </div>
                    <div className="time-slot">
                      <span>18:00</span>
                    </div>
                  </div>
                  <div className="days-grid">
                    <div className="day-column">
                      <div className="day-header">
                        <span>Monday</span>
                      </div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-401</span>
                        <span className="route-name">Route A</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-203</span>
                        <span className="route-name">Route C</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot maintenance">
                        <span className="truck-id">T-105</span>
                        <span className="route-name">Maintenance</span>
                      </div>
                      <div className="available schedule-slot"></div>
                    </div>
                    <div className="day-column">
                      <div className="day-header">
                        <span>Tuesday</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-302</span>
                        <span className="route-name">Route B</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-401</span>
                        <span className="route-name">Route D</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                    </div>
                    <div className="day-column">
                      <div className="day-header">
                        <span>Wednesday</span>
                      </div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-203</span>
                        <span className="route-name">Route A</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-105</span>
                        <span className="route-name">Route B</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-302</span>
                        <span className="route-name">Route C</span>
                      </div>
                      <div className="available schedule-slot"></div>
                    </div>
                    <div className="day-column">
                      <div className="day-header">
                        <span>Thursday</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-401</span>
                        <span className="route-name">Route A</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-203</span>
                        <span className="route-name">Route D</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                    </div>
                    <div className="day-column">
                      <div className="day-header">
                        <span>Friday</span>
                      </div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-302</span>
                        <span className="route-name">Route B</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-105</span>
                        <span className="route-name">Route A</span>
                      </div>
                      <div className="available schedule-slot"></div>
                      <div className="available schedule-slot"></div>
                      <div className="schedule-slot assigned">
                        <span className="truck-id">T-401</span>
                        <span className="route-name">Route C</span>
                      </div>
                      <div className="available schedule-slot"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="truck-list-container">
                <div className="truck-list-header">
                  <div className="truck-list-title-group">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                        <circle r="2" cx="17" cy="18"></circle>
                        <circle r="2" cx="7" cy="18"></circle>
                      </g>
                    </svg>
                    <h3 className="section-title">Live Fleet Status</h3>
                  </div>
                  <span className="live-indicator">
                    <span className="truck-scheduling-pulse-dot1"></span>
                    <span>
                      {" "}
                      Live
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </span>
                </div>
                <div className="truck-list">
                  <div className="truck-item">
                    <div className="truck-info">
                      <span className="truck-id-primary">T-401</span>
                      <span className="driver-name">Mike Rodriguez</span>
                    </div>
                    <div className="truck-status">
                      <span className="available status-badge">Available</span>
                      <span className="truck-details">
                        Cap: 85% | Loc: Depot A
                      </span>
                    </div>
                    <div className="truck-actions">
                      <button className="btn-sm btn btn-primary">Assign</button>
                    </div>
                  </div>
                  <div className="truck-item">
                    <div className="truck-info">
                      <span className="truck-id-primary">T-203</span>
                      <span className="driver-name">Sarah Chen</span>
                    </div>
                    <div className="truck-status">
                      <span className="on-route status-badge">On Route</span>
                      <span className="truck-details">
                        ETA: 14:30 | Stop: Bin #247
                      </span>
                    </div>
                    <div className="truck-actions">
                      <button className="btn-secondary btn-sm btn">
                        Track
                      </button>
                    </div>
                  </div>
                  <div className="truck-item">
                    <div className="truck-info">
                      <span className="truck-id-primary">T-105</span>
                      <span className="driver-name">James Wilson</span>
                    </div>
                    <div className="truck-status">
                      <span className="maintenance status-badge">
                        Maintenance
                      </span>
                      <span className="truck-details">
                        {" "}
                        Service: Oil Change | ETA: 16:00
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                    <div className="truck-actions">
                      <button className="btn-outline btn-sm btn">Hold</button>
                    </div>
                  </div>
                  <div className="truck-item">
                    <div className="truck-info">
                      <span className="truck-id-primary">T-302</span>
                      <span className="driver-name">Lisa Park</span>
                    </div>
                    <div className="truck-status">
                      <span className="available status-badge">Available</span>
                      <span className="truck-details">
                        Cap: 92% | Loc: Station B
                      </span>
                    </div>
                    <div className="truck-actions">
                      <button className="btn-sm btn btn-primary">Assign</button>
                    </div>
                  </div>
                  <div className="truck-item">
                    <div className="truck-info">
                      <span className="truck-id-primary">T-156</span>
                      <span className="driver-name">David Kumar</span>
                    </div>
                    <div className="truck-status">
                      <span className="on-route status-badge">On Route</span>
                      <span className="truck-details">
                        ETA: 15:45 | Stop: Bin #189
                      </span>
                    </div>
                    <div className="truck-actions">
                      <button className="btn-secondary btn-sm btn">
                        Track
                      </button>
                    </div>
                  </div>
                </div>
                <div className="quick-actions">
                  <h4 className="section-content">Quick Actions</h4>
                  <div className="action-buttons">
                    <button className="btn-accent btn">Emergency Pickup</button>
                    <button className="btn-outline btn">
                      Schedule Maintenance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="routes-alerts" className="routes-alerts-section">
          <div className="routes-alerts-container">
            <div className="section-header-center">
              <h2 className="section-title">Optimized Routes &amp; Alerts</h2>
              <p className="section-content">
                {" "}
                High-confidence route maps with urgent-bin flags and efficiency
                metrics
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="routes-alerts-grid">
              <div className="route-optimization-card">
                <div className="card-header1">
                  <div className="card-title-group">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle r="3" cx="6" cy="19"></circle>
                        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
                        <circle r="3" cx="18" cy="5"></circle>
                      </g>
                    </svg>
                    <h3 className="section-title">Route Efficiency</h3>
                  </div>
                </div>
                <div className="route-map-placeholder">
                  <img
                    alt="Aerial shot of an industrial truck parking lot in an urban area during daylight"
                    src="https://images.pexels.com/photos/8783861/pexels-photo-8783861.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                    className="route-background"
                  />
                  <div className="map-overlay">
                    <div className="route-markers">
                      <div className="urgent marker">
                        <span className="marker-id">B-247</span>
                        <span className="fill-level">95%</span>
                      </div>
                      <div className="marker high">
                        <span className="marker-id">B-189</span>
                        <span className="fill-level">82%</span>
                      </div>
                      <div className="marker normal">
                        <span className="marker-id">B-034</span>
                        <span className="fill-level">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="route-metrics">
                  <div className="metric-item">
                    <span className="metric-label1">Distance</span>
                    <span className="metric-value1">24.7 km</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label1">Service Time</span>
                    <span className="metric-value1">4.2 hrs</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label1">Fuel Impact</span>
                    <span className="metric-value1">-12%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label1">CO₂ Reduction</span>
                    <span className="metric-value1">8.4 kg</span>
                  </div>
                </div>
                <div className="route-actions">
                  <button className="btn btn-primary">Assign Route</button>
                  <button className="btn-secondary btn">
                    Compare Alternatives
                  </button>
                </div>
              </div>
              <div className="urgent-alerts-card">
                <div className="card-header1">
                  <div className="card-title-group">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 13h.01M12 6v3M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <h3 className="section-title">Priority Alerts</h3>
                  </div>
                  <span className="alert-count">5 Active</span>
                </div>
                <div className="alerts-list1">
                  <div className="critical alert-item">
                    <div className="alert-icon">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="alert-content1">
                      <span className="alert-title1">Bin #247 Critical</span>
                      <span className="alert-details">
                        {" "}
                        95% full • Last update: 2 mins ago
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                    <div className="alert-priority">
                      <span>URGENT</span>
                    </div>
                  </div>
                  <div className="high alert-item">
                    <div className="alert-icon">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="alert-content1">
                      <span className="alert-title1">Route A Delay</span>
                      <span className="alert-details">
                        {" "}
                        T-203 behind 15 mins • ETA updated
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                    <div className="alert-priority">
                      <span>HIGH</span>
                    </div>
                  </div>
                  <div className="medium alert-item">
                    <div className="alert-icon">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="alert-content1">
                      <span className="alert-title1">Bin #189 High Fill</span>
                      <span className="alert-details">
                        {" "}
                        82% full • Schedule within 4 hours
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                    <div className="alert-priority">
                      <span>MEDIUM</span>
                    </div>
                  </div>
                  <div className="medium alert-item">
                    <div className="alert-icon">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                          <circle r="3" cx="12" cy="12"></circle>
                        </g>
                      </svg>
                    </div>
                    <div className="alert-content1">
                      <span className="alert-title1">T-105 Maintenance</span>
                      <span className="alert-details">
                        {" "}
                        Scheduled service • Available at 16:00
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                    <div className="alert-priority">
                      <span>SCHEDULED</span>
                    </div>
                  </div>
                </div>
                <div className="safety-compliance">
                  <h4 className="section-content">Safety &amp; Compliance</h4>
                  <div className="compliance-items">
                    <div className="compliance-item1">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <span>All routes certified</span>
                    </div>
                    <div className="compliance-item1">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <span>Driver hours compliant</span>
                    </div>
                    <div className="compliance-item1 warning">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <span>Route B: Access restriction</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="live-tracker" className="live-tracker-section">
          <div className="live-tracker-container">
            <div className="section-header">
              <h2 className="section-title">Live Truck Tracker</h2>
              <p className="section-content">
                {" "}
                Real-time operational oversight for fleet reliability and
                performance monitoring
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="tracker-grid">
              <div className="status-overview tracker-card">
                <div className="card-header1">
                  <h3 className="section-title">Fleet Status Overview</h3>
                  <div className="live-indicator">
                    <span className="pulse-dot"></span>
                    <span>
                      {" "}
                      Live Updates
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div className="status-summary">
                  <div className="status-stat">
                    <span className="stat-number">4</span>
                    <span className="stat-label1">Available</span>
                  </div>
                  <div className="status-stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label1">On Route</span>
                  </div>
                  <div className="status-stat">
                    <span className="stat-number">1</span>
                    <span className="stat-label1">Maintenance</span>
                  </div>
                </div>
                <div className="performance-metrics">
                  <div className="metric-bar">
                    <span className="metric-label1">Fleet Utilization</span>
                    <div className="progress-bar">
                      <div className="truck-scheduling-progress-fill1 progress-fill"></div>
                    </div>
                    <span className="metric-percentage">78%</span>
                  </div>
                  <div className="metric-bar">
                    <span className="metric-label1">On-Time Rate</span>
                    <div className="progress-bar">
                      <div className="truck-scheduling-progress-fill2 progress-fill"></div>
                    </div>
                    <span className="metric-percentage">94%</span>
                  </div>
                </div>
              </div>
              <div className="tracker-card active-trucks">
                <div className="card-header1">
                  <h3 className="section-title">Active Trucks</h3>
                  <span className="truck-count">8 Active</span>
                </div>
                <div className="active-trucks-list">
                  <div className="truck-row">
                    <div className="truck-basic-info">
                      <span className="truck-id">T-401</span>
                      <span className="driver">Mike Rodriguez</span>
                      <span className="available status-badge">Available</span>
                    </div>
                    <div className="truck-details">
                      <span className="detail-item1">Load: 85%</span>
                      <span className="detail-item1">Loc: Depot A</span>
                      <span className="detail-item1">On-time: 96%</span>
                    </div>
                    <div className="truck-actions-compact">
                      <button className="btn-sm btn btn-primary">Assign</button>
                      <button className="btn-secondary btn-sm btn">
                        <svg
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zm.894.211v15M9 3.236v15"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="truck-row">
                    <div className="truck-basic-info">
                      <span className="truck-id">T-203</span>
                      <span className="driver">Sarah Chen</span>
                      <span className="on-route status-badge">On Route</span>
                    </div>
                    <div className="truck-details">
                      <span className="detail-item1">ETA: 14:30</span>
                      <span className="detail-item1">Stop: B-247</span>
                      <span className="detail-item1">Progress: 67%</span>
                    </div>
                    <div className="truck-actions-compact">
                      <button className="btn-secondary btn-sm btn">
                        Track
                      </button>
                      <button className="btn-outline btn-sm btn">
                        Contact
                      </button>
                    </div>
                  </div>
                  <div className="truck-row">
                    <div className="truck-basic-info">
                      <span className="truck-id">T-105</span>
                      <span className="driver">James Wilson</span>
                      <span className="maintenance status-badge">
                        Maintenance
                      </span>
                    </div>
                    <div className="truck-details">
                      <span className="detail-item1">Service: Oil Change</span>
                      <span className="detail-item1">ETA: 16:00</span>
                      <span className="detail-item1">Uptime: 98%</span>
                    </div>
                    <div className="truck-actions-compact">
                      <button className="btn-outline btn-sm btn">Hold</button>
                      <button className="btn-secondary btn-sm btn">
                        Update
                      </button>
                    </div>
                  </div>
                  <div className="truck-row">
                    <div className="truck-basic-info">
                      <span className="truck-id">T-302</span>
                      <span className="driver">Lisa Park</span>
                      <span className="on-route status-badge">On Route</span>
                    </div>
                    <div className="truck-details">
                      <span className="detail-item1">ETA: 15:15</span>
                      <span className="detail-item1">Stop: B-189</span>
                      <span className="detail-item1">Progress: 42%</span>
                    </div>
                    <div className="truck-actions-compact">
                      <button className="btn-secondary btn-sm btn">
                        Track
                      </button>
                      <button className="btn-outline btn-sm btn">
                        Reassign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tracker-card safety-compliance">
                <div className="card-header1">
                  <h3 className="section-title">Safety &amp; Compliance</h3>
                </div>
                <div className="safety-flags">
                  <div className="compliant safety-item">
                    <svg
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span>All drivers certified</span>
                  </div>
                  <div className="compliant safety-item">
                    <svg
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span>Vehicle inspections current</span>
                  </div>
                  <div className="safety-item attention">
                    <svg
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6v6l4 2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <circle r="10" cx="12" cy="12"></circle>
                    </svg>
                    <span>T-156: Inspection due in 3 days</span>
                  </div>
                </div>
                <div className="recent-inspections">
                  <h4 className="section-content">Recent Inspections</h4>
                  <div className="inspection-list">
                    <div className="inspection-item">
                      <span className="inspection-truck">T-401</span>
                      <span className="inspection-date">Nov 15</span>
                      <span className="inspection-status passed">Passed</span>
                    </div>
                    <div className="inspection-item">
                      <span className="inspection-truck">T-203</span>
                      <span className="inspection-date">Nov 14</span>
                      <span className="inspection-status passed">Passed</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="quick-actions tracker-card">
                <div className="card-header1">
                  <h3 className="section-title">Quick Actions</h3>
                </div>
                <div className="action-grid">
                  <button className="action-button emergency">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span>Emergency Dispatch</span>
                  </button>
                  <button className="action-button maintenance">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                        <circle r="3" cx="12" cy="12"></circle>
                      </g>
                    </svg>
                    <span>Schedule Service</span>
                  </button>
                  <button className="action-button reassign">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle r="3" cx="6" cy="19"></circle>
                        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
                        <circle r="3" cx="18" cy="5"></circle>
                      </g>
                    </svg>
                    <span>Bulk Reassign</span>
                  </button>
                  <button className="action-button priority">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                        <circle r="2" cx="17" cy="18"></circle>
                        <circle r="2" cx="7" cy="18"></circle>
                      </g>
                    </svg>
                    <span>Priority Collection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="history-transactions" className="history-section">
          <div className="history-container">
            <div className="section-header">
              <h2 className="section-title">
                Scheduling History &amp; Transactions
              </h2>
              <p className="section-content">
                {" "}
                Comprehensive audit trail with immutable transaction logs for
                compliance and performance review
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="history-layout">
              <div className="transaction-log">
                <div className="log-header">
                  <div className="log-title-group">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 6v6l4 2"></path>
                        <circle r="10" cx="12" cy="12"></circle>
                      </g>
                    </svg>
                    <h3 className="section-title">Recent Activity</h3>
                  </div>
                  <div className="log-controls">
                    <button className="btn-secondary btn-sm btn">
                      <svg
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M2 5h20M6 12h12m-9 7h6"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <span>
                        {" "}
                        Filter
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </button>
                    <button className="btn-outline btn-sm btn">Export</button>
                  </div>
                </div>
                <div className="transaction-table">
                  <div className="table-header">
                    <div className="header-cell timestamp">
                      <span>Timestamp</span>
                    </div>
                    <div className="header-cell truck">
                      <span>Truck</span>
                    </div>
                    <div className="header-cell driver">
                      <span>Driver</span>
                    </div>
                    <div className="route header-cell">
                      <span>Route/Bin</span>
                    </div>
                    <div className="header-cell duration">
                      <span>Duration</span>
                    </div>
                    <div className="result header-cell">
                      <span>Result</span>
                    </div>
                    <div className="header-cell actions">
                      <span>Actions</span>
                    </div>
                  </div>
                  <div className="table-body">
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 14:32</span>
                      </div>
                      <div className="cell truck">
                        <span>T-203</span>
                      </div>
                      <div className="cell driver">
                        <span>S. Chen</span>
                      </div>
                      <div className="route cell">
                        <span>B-247 (Route A)</span>
                      </div>
                      <div className="cell duration">
                        <span>18 min</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge success">Success</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 13:45</span>
                      </div>
                      <div className="cell truck">
                        <span>T-401</span>
                      </div>
                      <div className="cell driver">
                        <span>M. Rodriguez</span>
                      </div>
                      <div className="route cell">
                        <span>B-189 (Route C)</span>
                      </div>
                      <div className="cell duration">
                        <span>22 min</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge success">Success</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 12:15</span>
                      </div>
                      <div className="cell truck">
                        <span>T-302</span>
                      </div>
                      <div className="cell driver">
                        <span>L. Park</span>
                      </div>
                      <div className="route cell">
                        <span>B-034 (Route B)</span>
                      </div>
                      <div className="cell duration">
                        <span>15 min</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge partial">Partial</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 11:30</span>
                      </div>
                      <div className="cell truck">
                        <span>T-105</span>
                      </div>
                      <div className="cell driver">
                        <span>J. Wilson</span>
                      </div>
                      <div className="route cell">
                        <span>B-156 (Route A)</span>
                      </div>
                      <div className="cell duration">
                        <span>-</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge failure">Failure</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 10:45</span>
                      </div>
                      <div className="cell truck">
                        <span>T-156</span>
                      </div>
                      <div className="cell driver">
                        <span>D. Kumar</span>
                      </div>
                      <div className="route cell">
                        <span>B-078 (Route D)</span>
                      </div>
                      <div className="cell duration">
                        <span>19 min</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge success">Success</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="timestamp cell">
                        <span>Nov 18, 09:20</span>
                      </div>
                      <div className="cell truck">
                        <span>T-203</span>
                      </div>
                      <div className="cell driver">
                        <span>S. Chen</span>
                      </div>
                      <div className="route cell">
                        <span>B-023 (Route A)</span>
                      </div>
                      <div className="cell duration">
                        <span>16 min</span>
                      </div>
                      <div className="result cell">
                        <span className="result-badge success">Success</span>
                      </div>
                      <div className="actions cell">
                        <button className="btn-link btn-sm btn">Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-header1">
                  <h3 className="section-title">Operational Insights</h3>
                  <span className="update-time">Last updated: 2 min ago</span>
                </div>
                <div className="kpi-grid">
                  <div className="kpi-item">
                    <span className="kpi-value">94.2%</span>
                    <span className="kpi-label">On-Time Rate</span>
                    <span className="kpi-trend positive">+2.1%</span>
                  </div>
                  <div className="kpi-item">
                    <span className="kpi-value">18.5</span>
                    <span className="kpi-label">Avg. Completion (min)</span>
                    <span className="kpi-trend negative">+1.2</span>
                  </div>
                  <div className="kpi-item">
                    <span className="kpi-value">2.3%</span>
                    <span className="kpi-label">Failure Rate</span>
                    <span className="kpi-trend positive">-0.5%</span>
                  </div>
                </div>
                <div className="failure-breakdown">
                  <h4 className="section-content">Failure Root Causes</h4>
                  <div className="failure-items">
                    <div className="failure-item">
                      <span className="failure-type">Access Denial</span>
                      <div className="failure-bar">
                        <div className="truck-scheduling-failure-fill1 failure-fill"></div>
                      </div>
                      <span className="failure-count">3</span>
                    </div>
                    <div className="failure-item">
                      <span className="failure-type">Mechanical Fault</span>
                      <div className="failure-bar">
                        <div className="truck-scheduling-failure-fill2 failure-fill"></div>
                      </div>
                      <span className="failure-count">2</span>
                    </div>
                    <div className="failure-item">
                      <span className="failure-type">Route Blockage</span>
                      <div className="failure-bar">
                        <div className="truck-scheduling-failure-fill3 failure-fill"></div>
                      </div>
                      <span className="failure-count">1</span>
                    </div>
                  </div>
                </div>
                <div className="export-options">
                  <h4 className="section-content">Export &amp; Integration</h4>
                  <div className="export-buttons">
                    <button className="btn-secondary btn-sm btn">
                      Export CSV
                    </button>
                    <button className="btn-secondary btn-sm btn">
                      Export PDF
                    </button>
                    <button className="btn-outline btn-sm btn">API Docs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="alerts-notifications" className="alerts-section1">
          <div className="alerts-container1">
            <div className="section-header">
              <h2 className="section-title">Alerts &amp; Notifications</h2>
              <p className="section-content">
                {" "}
                Critical event notifications prioritized for schedule-impacting
                decisions
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="alerts-layout">
              <div className="notifications-panel">
                <div className="panel-header">
                  <div className="panel-title-group">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 13h.01M12 6v3M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <h3 className="section-title">Critical Alerts</h3>
                  </div>
                  <div className="alert-status1">
                    <span className="live-indicator">
                      <span className="truck-scheduling-pulse-dot3"></span>
                      <span>
                        {" "}
                        5 Active
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                  </div>
                </div>
                <div className="notifications-list">
                  <div className="critical notification-item">
                    <div className="notification-icon">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">
                          {" "}
                          Overflow Alert: Bin #247
                          <span
                            dangerouslySetInnerHTML={{
                              __html: " ",
                            }}
                          />
                        </span>
                        <span className="notification-time">2 min ago</span>
                      </div>
                      <p className="notification-message">
                        {" "}
                        Critical fill level at 95%. Immediate collection
                        required to prevent overflow.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </p>
                      <div className="notification-details">
                        <span className="detail-badge">Priority: URGENT</span>
                        <span className="detail-badge">
                          Location: Downtown District
                        </span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-sm btn btn-primary">
                        Dispatch Now
                      </button>
                      <button className="btn-secondary btn-sm btn">
                        Reassign
                      </button>
                    </div>
                  </div>
                  <div className="delay notification-item">
                    <div className="notification-icon">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M12 6v6l4 2"></path>
                          <circle r="10" cx="12" cy="12"></circle>
                        </g>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">
                          Route Delay: T-203
                        </span>
                        <span className="notification-time">5 min ago</span>
                      </div>
                      <p className="notification-message">
                        {" "}
                        Truck T-203 is 15 minutes behind schedule. ETA updated
                        to 14:45.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </p>
                      <div className="notification-details">
                        <span className="detail-badge">
                          Impact: 3 stops affected
                        </span>
                        <span className="detail-badge">Driver: Sarah Chen</span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-secondary btn-sm btn">
                        Acknowledge
                      </button>
                      <button className="btn-outline btn-sm btn">
                        Contact Driver
                      </button>
                    </div>
                  </div>
                  <div className="notification-item maintenance">
                    <div className="notification-icon">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                          <circle r="3" cx="12" cy="12"></circle>
                        </g>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">
                          {" "}
                          Maintenance Alert: T-105
                          <span
                            dangerouslySetInnerHTML={{
                              __html: " ",
                            }}
                          />
                        </span>
                        <span className="notification-time">12 min ago</span>
                      </div>
                      <p className="notification-message">
                        {" "}
                        Scheduled service window conflicts with assigned route.
                        Service due by 16:00.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </p>
                      <div className="notification-details">
                        <span className="detail-badge">
                          Service: Oil Change
                        </span>
                        <span className="detail-badge">
                          Backup: T-156 available
                        </span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-secondary btn-sm btn">
                        Assign Backup
                      </button>
                      <button className="btn-outline btn-sm btn">
                        Defer Service
                      </button>
                    </div>
                  </div>
                  <div className="success notification-item">
                    <div className="notification-icon">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">
                          {" "}
                          Collection Completed: B-189
                          <span
                            dangerouslySetInnerHTML={{
                              __html: " ",
                            }}
                          />
                        </span>
                        <span className="notification-time">18 min ago</span>
                      </div>
                      <p className="notification-message">
                        {" "}
                        Successful pickup completed by T-302. Bin status updated
                        to 15% full.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </p>
                      <div className="notification-details">
                        <span className="detail-badge">Duration: 16 min</span>
                        <span className="detail-badge">Load: 2.4 tons</span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-outline btn-sm btn">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="incident notification-item">
                    <div className="notification-icon">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Zm-3 7v4m0 4h.01"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">
                          {" "}
                          Route Closure: Oak Street
                          <span
                            dangerouslySetInnerHTML={{
                              __html: " ",
                            }}
                          />
                        </span>
                        <span className="notification-time">25 min ago</span>
                      </div>
                      <p className="notification-message">
                        {" "}
                        Road closure reported on Oak Street affects Route B.
                        Alternate path suggested.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </p>
                      <div className="notification-details">
                        <span className="detail-badge">
                          Impact: +8 min delay
                        </span>
                        <span className="detail-badge">
                          Alternative route available
                        </span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      <button className="btn-sm btn btn-primary">
                        Update Route
                      </button>
                      <button className="btn-secondary btn-sm btn">
                        Notify Driver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="controls-panel">
                <div className="panel-header">
                  <h3 className="section-title">Filter &amp; Actions</h3>
                </div>
                <div className="filter-section">
                  <h4 className="section-content">Filter by Type</h4>
                  <div className="filter-options">
                    <label className="filter-checkbox">
                      <input type="checkbox" checked="true" />
                      <span className="checkmark"></span>
                      <span>
                        {" "}
                        Critical Alerts
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" checked="true" />
                      <span className="checkmark"></span>
                      <span>
                        {" "}
                        Delay Notifications
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" checked="true" />
                      <span className="checkmark"></span>
                      <span>
                        {" "}
                        Maintenance Alerts
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      <span>
                        {" "}
                        Success Confirmations
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" checked="true" />
                      <span className="checkmark"></span>
                      <span>
                        {" "}
                        Incident Reports
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="priority-section">
                  <h4 className="section-content">Priority Levels</h4>
                  <div className="priority-stats">
                    <div className="critical priority-stat">
                      <span className="priority-count">1</span>
                      <span className="priority-label">Critical</span>
                    </div>
                    <div className="high priority-stat">
                      <span className="priority-count">2</span>
                      <span className="priority-label">High</span>
                    </div>
                    <div className="medium priority-stat">
                      <span className="priority-count">2</span>
                      <span className="priority-label">Medium</span>
                    </div>
                  </div>
                </div>
                <div className="bulk-actions">
                  <h4 className="section-content">Bulk Actions</h4>
                  <div className="bulk-buttons">
                    <button className="btn-secondary btn">
                      Acknowledge All
                    </button>
                    <button className="btn-outline btn">Export Log</button>
                    <button className="btn-accent btn">
                      Emergency Protocol
                    </button>
                  </div>
                </div>
                <div className="integration-status">
                  <h4 className="section-content">System Status</h4>
                  <div className="status-indicators">
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <span>MongoDB Feed</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <span>API Gateway</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot online"></div>
                      <span>Notification Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default TruckScheduling;
