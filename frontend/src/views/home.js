import React from "react";

import Script from "dangerous-html/react";
import { Helmet } from "react-helmet";

import Navigation from "../components/navigation";
import Footer from "../components/footer";
import "./home.css";

const Home = (props) => {
  return (
    <div className="home-container1">
      <Helmet>
        <title>Sophisticated Quizzical Wasp</title>
        <meta property="og:title" content="Sophisticated Quizzical Wasp" />
      </Helmet>
      <Navigation></Navigation>
      <div className="home-container2">
        <div className="home-container3">
          <Script
            html={`<style>
        @keyframes fadeInUp {from {opacity: 0;
transform: translateY(30px);}
to {opacity: 1;
transform: translateY(0);}}@keyframes fadeInRight {from {opacity: 0;
transform: translateX(30px);}
to {opacity: 1;
transform: translateX(0);}}@keyframes pulse {0%,100% {opacity: 1;}
50% {opacity: 0.5;}}
        </style> `}
          ></Script>
        </div>
      </div>
      <div className="home-container4">
        <div className="home-container5">
          <Script
            html={`<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: var(--font-family-body);
  line-height: var(--line-height-normal);
  color: var(--color-on-surface);
  background: var(--color-surface);
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="home-container6">
        <div className="home-container7">
          <Script
            html={`<script defer data-name="wastewise-dashboard">
(function(){
  // Smooth scroll behavior for internal links
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Real-time clock update for transaction times
  function updateTransactionTimes() {
    const timeElements = document.querySelectorAll(
      ".transaction-time, .alert-time, .feed-time"
    )
    timeElements.forEach((element) => {
      const currentTime = new Date()
      const hours = currentTime.getHours().toString().padStart(2, "0")
      const minutes = currentTime.getMinutes().toString().padStart(2, "0")

      if (element.classList.contains("feed-time")) {
        element.textContent = \`\${hours}:\${minutes}\`
      }
    })
  }

  // Update times every minute
  updateTransactionTimes()
  setInterval(updateTransactionTimes, 60000)

  // Alert card interaction animations
  const alertCards = document.querySelectorAll(".alert-card")
  alertCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.01)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Metric card hover effects
  const metricCards = document.querySelectorAll(".metric-card")
  metricCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".metric-icon")
      if (icon) {
        icon.style.transform = "rotate(5deg) scale(1.1)"
      }
    })

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".metric-icon")
      if (icon) {
        icon.style.transform = "rotate(0deg) scale(1)"
      }
    })
  })

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item")
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    const answer = item.querySelector(".faq-answer")

    if (question && answer) {
      question.style.cursor = "pointer"
      answer.style.maxHeight = "100px"
      answer.style.overflow = "hidden"
      answer.style.transition = "max-height 0.3s ease"

      question.addEventListener("click", function () {
        const isExpanded = answer.style.maxHeight !== "100px"

        if (isExpanded) {
          answer.style.maxHeight = "100px"
          question.style.color = "var(--color-on-surface)"
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px"
          question.style.color = "var(--color-primary)"
        }
      })
    }
  })

  // Live feed simulation
  const feedMessages = [
    "Bin #23 reached 88% capacity - Route optimization suggested",
    "Truck T-08 completed route R-15 - 24 bins collected",
    "Sector 4A maintenance window scheduled for tomorrow 6:00 AM",
    "Emergency pickup dispatched to Bin #67 - Overflow detected",
    "Fleet utilization at 78% - 3 trucks available for assignment",
  ]

  function updateLiveFeed() {
    const feedItem = document.querySelector(".feed-item .feed-message")
    if (feedItem) {
      const randomMessage =
        feedMessages[Math.floor(Math.random() * feedMessages.length)]
      feedItem.style.opacity = "0"

      setTimeout(() => {
        feedItem.textContent = randomMessage
        feedItem.style.opacity = "1"
      }, 300)
    }
  }

  // Update feed every 30 seconds
  setInterval(updateLiveFeed, 30000)

  // Filter functionality for alerts
  const filterSelects = document.querySelectorAll(".filter-select")
  filterSelects.forEach((select) => {
    select.addEventListener("change", function () {
      const filterValue = this.value.toLowerCase()
      const alerts = document.querySelectorAll(".alert-card")

      alerts.forEach((alert) => {
        const alertType = alert
          .querySelector(".alert-type")
          .textContent.toLowerCase()
        const shouldShow =
          filterValue === "all severities" ||
          filterValue === "all areas" ||
          filterValue === "all assets" ||
          alertType.includes(filterValue)

        if (shouldShow) {
          alert.style.display = "block"
          alert.style.opacity = "1"
        } else {
          alert.style.opacity = "0"
          setTimeout(() => {
            if (alert.style.opacity === "0") {
              alert.style.display = "none"
            }
          }, 300)
        }
      })
    })
  })

  // Progressive loading animation for cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Apply observer to all major cards
  const cards = document.querySelectorAll(
    ".metric-card, .alert-card, .visual-card, .support-card, .transaction-card, .faq-item"
  )
  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  // Button click feedback
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = \`
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: \${size}px;
      height: \${size}px;
      left: \${x}px;
      top: \${y}px;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    \`

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add CSS for ripple animation
  const style = document.createElement("style")
  style.textContent = \`
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
\`
  document.head.appendChild(style)

  console.log("WasteWise Dashboard initialized successfully")
})()
</script>`}
          ></Script>
        </div>
      </div>
      <section id="hero" className="hero-section">
        <div className="hero-background">
          <video
            src="https://videos.pexels.com/video-files/3757013/3757013-hd_1920_1080_24fps.mp4"
            loop="true"
            muted="true"
            autoPlay="true"
            className="hero-video"
          ></video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">WasteWise Dashboard</h1>
              <p className="hero-subtitle">City Waste Command Center</p>
              <p className="hero-description">
                {" "}
                Operate with confidence. Real-time insights, prioritized
                actions, and direct access to fleet and site controls for
                reliable municipal waste operations.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">
                    <span>18.4 tons</span>
                  </div>
                  <div className="stat-label">
                    <span>Today&apos;s Collection</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    <span>12</span>
                  </div>
                  <div className="stat-label">
                    <span>Active Trucks</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    <span>3</span>
                  </div>
                  <div className="stat-label">
                    <span>Critical Alerts</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary">Access Dashboard</button>
            </div>
            <div className="hero-shortcuts">
              <h3 className="shortcuts-title">Quick Actions</h3>
              <div className="shortcuts-list">
                <a href="#">
                  <div className="shortcut-item">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span>View Bins</span>
                  </div>
                </a>
                <a href="#">
                  <div className="shortcut-item">
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
                    <span>Schedule Truck</span>
                  </div>
                </a>
                <a href="#">
                  <div className="shortcut-item">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
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
                    <span>Optimize Routes</span>
                  </div>
                </a>
                <a href="#">
                  <div className="shortcut-item">
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
                        <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                        <path d="m19 9l-5 5l-4-4l-3 3"></path>
                      </g>
                    </svg>
                    <span>Landfill Status</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="stats-quick-links" className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stats-column">
              <h2 className="section-title">Key Operational Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">
                      <span>1,248</span>
                    </div>
                    <div className="metric-label">
                      <span>Bins Monitored</span>
                    </div>
                    <div className="metric-breakdown">
                      <span className="status-empty">Empty 46%</span>
                      <span className="status-half">Half 38%</span>
                      <span className="status-full">Full 13%</span>
                      <span className="status-overflow">Overflow 3%</span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <svg
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
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
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">
                      <span>72</span>
                    </div>
                    <div className="metric-label">
                      <span>Active Routes</span>
                    </div>
                    <div className="metric-detail">
                      <span>
                        {" "}
                        54 trucks on-route • Avg 18 pickups/route
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
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
                        <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                        <path d="m19 9l-5 5l-4-4l-3 3"></path>
                      </g>
                    </svg>
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">
                      <span>62%</span>
                    </div>
                    <div className="metric-label">
                      <span>Landfill Capacity</span>
                    </div>
                    <div className="metric-detail">
                      <span>Alert threshold in 18 days</span>
                    </div>
                  </div>
                </div>
                <div className="urgent metric-card">
                  <div className="metric-icon">
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
                  </div>
                  <div className="metric-content">
                    <div className="metric-value">
                      <span>14</span>
                    </div>
                    <div className="metric-label">
                      <span>Urgent Collections</span>
                    </div>
                    <div className="metric-detail">
                      <span>Bins above 90% capacity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="quick-actions-column">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn btn btn-primary">
                  <svg
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
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
                  <span>
                    {" "}
                    Create Route Assignment
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </button>
                <button className="btn-secondary action-btn btn">
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
                      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                      <circle r="3" cx="12" cy="12"></circle>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    Mark Truck Maintenance
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </button>
                <button className="action-btn btn-accent btn">
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
                  <span>
                    {" "}
                    Deploy Emergency Pickup
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </button>
                <button className="action-btn btn-outline btn">
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
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect x="3" y="3" rx="1" width="7" height="9"></rect>
                        <rect x="14" y="3" rx="1" width="7" height="5"></rect>
                        <rect x="14" y="12" rx="1" width="7" height="9"></rect>
                        <rect x="3" y="16" rx="1" width="7" height="5"></rect>
                      </g>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    Export Report
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </button>
              </div>
              <div className="compliance-info">
                <h3 className="compliance-title">
                  Integrations &amp; Confidence
                </h3>
                <div className="compliance-item">
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
                  <span>Real-time MongoDB stream connected</span>
                </div>
                <div className="compliance-item">
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
                  <span>Node.js API endpoints ready</span>
                </div>
                <div className="compliance-item">
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
                  <span>98.6% SLA compliance rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="alerts" className="alerts-section">
        <div className="alerts-container">
          <div className="alerts-header">
            <h2 className="section-title">Real-Time Alerts</h2>
            <p className="section-subtitle">
              {" "}
              Live feed of system-critical notifications and status updates
              sourced from your MongoDB stream
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </div>
          <div className="alerts-grid">
            <div className="alerts-list">
              <div className="alert-card critical">
                <div className="alert-header">
                  <div className="alert-status"></div>
                  <span className="alert-type">Critical Alert</span>
                  <span className="alert-time">2m ago</span>
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">Bin #12 — 95% full</h4>
                  <p className="alert-description">
                    Immediate pickup recommended
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-sm btn btn-primary">
                    Assign Truck
                  </button>
                  <button className="btn-outline btn-sm btn">
                    View Details
                  </button>
                </div>
              </div>
              <div className="alert-card warning">
                <div className="alert-header">
                  <div className="alert-status"></div>
                  <span className="alert-type">Overflow Risk</span>
                  <span className="alert-time">7m ago</span>
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">
                    Sector 7B — Multiple bins at 85%+
                  </h4>
                  <p className="alert-description">
                    Route optimization suggested
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-secondary btn-sm btn">
                    Optimize Route
                  </button>
                  <button className="btn-outline btn-sm btn">
                    Acknowledge
                  </button>
                </div>
              </div>
              <div className="info alert-card">
                <div className="alert-header">
                  <div className="alert-status"></div>
                  <span className="alert-type">Fleet Status</span>
                  <span className="alert-time">3m ago</span>
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">
                    Truck T-04 — Sensor disconnect detected
                  </h4>
                  <p className="alert-description">
                    {" "}
                    Investigate telemetry (last heartbeat 3m ago)
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-sm btn-accent btn">Investigate</button>
                  <button className="btn-outline btn-sm btn">
                    Create Ticket
                  </button>
                </div>
              </div>
              <div className="alert-card warning">
                <div className="alert-header">
                  <div className="alert-status"></div>
                  <span className="alert-type">Landfill Warning</span>
                  <span className="alert-time">14m ago</span>
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">
                    North Tip Facility — Usage 92% capacity
                  </h4>
                  <p className="alert-description">Prepare diversion plan</p>
                </div>
                <div className="alert-actions">
                  <button className="btn-sm btn btn-primary">
                    Create Plan
                  </button>
                  <button className="btn-outline btn-sm btn">
                    View Facility
                  </button>
                </div>
              </div>
              <div className="alert-card resolved">
                <div className="alert-header">
                  <div className="alert-status"></div>
                  <span className="alert-type">Resolved</span>
                  <span className="alert-time">10m ago</span>
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">
                    Bin #03 — Collection completed
                  </h4>
                  <p className="alert-description">Transaction recorded</p>
                </div>
                <div className="alert-actions">
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
                  <span>Completed</span>
                </div>
              </div>
            </div>
            <div className="alerts-sidebar">
              <div className="filters-card">
                <h3 className="filters-title">Alert Filters</h3>
                <div className="filter-group">
                  <label className="filter-label">Severity</label>
                  <select className="filter-select">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>Warning</option>
                    <option>Info</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Area</label>
                  <select className="filter-select">
                    <option>All Areas</option>
                    <option>Sector 7A</option>
                    <option>Sector 7B</option>
                    <option>North District</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Asset Type</label>
                  <select className="filter-select">
                    <option>All Assets</option>
                    <option>Bins</option>
                    <option>Trucks</option>
                    <option>Facilities</option>
                  </select>
                </div>
              </div>
              <div className="actions-card">
                <h3 className="actions-title">Bulk Actions</h3>
                <button className="action-btn btn-outline btn">
                  Mark All Read
                </button>
                <button className="btn-secondary action-btn btn">
                  Export Alerts
                </button>
                <button className="action-btn btn btn-primary">
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="overview-visuals" className="visuals-section">
        <div className="visuals-container">
          <div className="visuals-header">
            <h2 className="section-title">City Overview Dashboard</h2>
            <p className="section-subtitle">
              {" "}
              At-a-glance system health with compact previews and priority
              indicators
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </div>
          <div className="visuals-grid">
            <div className="visual-card">
              <div className="card-header">
                <h3 className="card-title">Bins Status</h3>
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <div className="card-visual">
                <img
                  alt="Bins overview"
                  src="https://images.pexels.com/photos/5099271/pexels-photo-5099271.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  className="visual-image"
                />
                <div className="visual-overlay">
                  <div className="status-chips">
                    <span className="empty status-chip">Empty 46%</span>
                    <span className="half status-chip">Half 38%</span>
                    <span className="full status-chip">Full 13%</span>
                    <span className="overflow status-chip">Overflow 3%</span>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-sm btn btn-primary">
                  View All Bins
                </button>
              </div>
            </div>
            <div className="visual-card">
              <div className="card-header">
                <h3 className="card-title">Route Optimization</h3>
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
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
              </div>
              <div className="card-visual">
                <img
                  alt="Route preview"
                  src="https://images.pexels.com/photos/3582392/pexels-photo-3582392.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  className="visual-image"
                />
                <div className="visual-overlay">
                  <div className="route-stats">
                    <div className="route-stat">
                      <span className="stat-value">72</span>
                      <span className="stat-label">Active Routes</span>
                    </div>
                    <div className="route-stat">
                      <span className="stat-value">18</span>
                      <span className="stat-label">Avg Pickups</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-secondary btn-sm btn">
                  Optimize Routes
                </button>
              </div>
            </div>
            <div className="visual-card">
              <div className="card-header">
                <h3 className="card-title">Fleet Status</h3>
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
              </div>
              <div className="card-content">
                <div className="fleet-stats">
                  <div className="available fleet-stat">
                    <div className="fleet-number">
                      <span>8</span>
                    </div>
                    <div className="fleet-label">
                      <span>Available</span>
                    </div>
                  </div>
                  <div className="fleet-stat active">
                    <div className="fleet-number">
                      <span>12</span>
                    </div>
                    <div className="fleet-label">
                      <span>On Route</span>
                    </div>
                  </div>
                  <div className="fleet-stat maintenance">
                    <div className="fleet-number">
                      <span>2</span>
                    </div>
                    <div className="fleet-label">
                      <span>Maintenance</span>
                    </div>
                  </div>
                </div>
                <div className="next-assignment">
                  <h4>Next Assignment</h4>
                  <p>Truck T-15 → Sector 7B (ETA: 14 min)</p>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-sm btn-accent btn">
                  Schedule Truck
                </button>
              </div>
            </div>
          </div>
          <div className="live-feed">
            <div className="feed-header">
              <h3 className="feed-title">Live Feed Ticker</h3>
              <div className="feed-indicator">
                <div className="indicator-dot"></div>
                <span>Live</span>
              </div>
            </div>
            <div className="feed-content">
              <div className="feed-item">
                <span className="feed-time">11:42</span>
                <span className="feed-message">
                  {" "}
                  Bin #47 reached 91% capacity - Auto-assigned to Route R-23
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </span>
                <a href="#">
                  <div className="feed-link">
                    <span>View Details</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="support-settings" className="support-section">
        <div className="support-container">
          <div className="support-header">
            <h2 className="section-title">Support &amp; Settings</h2>
            <p className="section-subtitle">
              {" "}
              Fast, secure access to system controls and developer resources
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </div>
          <div className="support-grid">
            <div className="support-card">
              <div className="support-icon">
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
              </div>
              <h3 className="support-title">API Documentation</h3>
              <p className="support-description">
                {" "}
                Comprehensive Node.js-ready API reference, example endpoints,
                and payload samples for rapid integration with municipal
                systems.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn-outline btn">View Docs</button>
            </div>
            <div className="support-card">
              <div className="support-icon">
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
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="3" rx="1" width="7" height="9"></rect>
                      <rect x="14" y="3" rx="1" width="7" height="5"></rect>
                      <rect x="14" y="12" rx="1" width="7" height="9"></rect>
                      <rect x="3" y="16" rx="1" width="7" height="5"></rect>
                    </g>
                  </g>
                </svg>
              </div>
              <h3 className="support-title">Backend Placeholders</h3>
              <p className="support-description">
                {" "}
                Ready-to-wire Node.js hooks and sample environment configs to
                accelerate deployment and testing.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn-outline btn">Access Hooks</button>
            </div>
            <div className="support-card">
              <div className="support-icon">
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
                    <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                    <circle r="3" cx="12" cy="12"></circle>
                  </g>
                </svg>
              </div>
              <h3 className="support-title">Admin Settings</h3>
              <p className="support-description">
                {" "}
                Centralized configuration for user roles, notification
                thresholds, geofencing zones, and data-retention policies.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn-outline btn">Configure</button>
            </div>
            <div className="support-card">
              <div className="support-icon">
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
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
              <h3 className="support-title">Security &amp; Compliance</h3>
              <p className="support-description">
                {" "}
                Role-based access controls, audit logging, and guidance on
                meeting municipal procurement and data-protection standards.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn-outline btn">Security Center</button>
            </div>
            <div className="support-card">
              <div className="support-icon">
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <h3 className="support-title">Operational Tools</h3>
              <p className="support-description">
                {" "}
                Toggle real-time feeds, manage maintenance windows, and set
                automated alerts for overflow or critical landfill levels.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn-outline btn">Manage Tools</button>
            </div>
            <div className="support-card">
              <div className="support-icon">
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
              </div>
              <h3 className="support-title">Support &amp; SLAs</h3>
              <p className="support-description">
                {" "}
                Enterprise support options, escalation paths, and response-time
                commitments tailored for city operations.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <button className="btn btn-primary">Get Support</button>
            </div>
          </div>
        </div>
      </section>
      <section id="transactions" className="transactions-section">
        <div className="transactions-container">
          <div className="transactions-header">
            <h2 className="section-title">Recent Transactions</h2>
            <p className="section-subtitle">
              {" "}
              Auditable log of the latest truck-to-bin operations with
              timestamps and outcomes
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </div>
          <div className="transactions-grid">
            <div className="transaction-card completed">
              <div className="transaction-header">
                <div className="transaction-status">
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
                  <span className="status-text">Collected</span>
                </div>
                <span className="transaction-time">10:38</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-14 → Bin B-102</h4>
                <div className="transaction-details">
                  <span className="detail-item">Duration: 4m</span>
                  <span className="detail-item">Operator: R. Alvarez</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-outline btn-sm btn">View Details</button>
              </div>
            </div>
            <div className="failed transaction-card">
              <div className="transaction-header">
                <div className="transaction-status">
                  <svg
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m21 21l-9-9m0 0l-9-9m9 9l9-9m-9 9l-9 9"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span className="status-text">Failed</span>
                </div>
                <span className="transaction-time">09:52</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-03 → Bin B-047</h4>
                <div className="transaction-details">
                  <span className="detail-item">Issue: Mechanical</span>
                  <span className="detail-item">Auto-notified Maintenance</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-sm btn-accent btn">Create Ticket</button>
              </div>
            </div>
            <div className="partial transaction-card">
              <div className="transaction-header">
                <div className="transaction-status">
                  <svg
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
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
                  <span className="status-text">Partial</span>
                </div>
                <span className="transaction-time">09:10</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-07 → Bin B-210</h4>
                <div className="transaction-details">
                  <span className="detail-item">Collected: 70%</span>
                  <span className="detail-item">Operator: K. Singh</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-secondary btn-sm btn">Reschedule</button>
              </div>
            </div>
            <div className="transaction-card completed">
              <div className="transaction-header">
                <div className="transaction-status">
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
                  <span className="status-text">Collected</span>
                </div>
                <span className="transaction-time">08:44</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-12 → Bin B-312</h4>
                <div className="transaction-details">
                  <span className="detail-item">Overflow mitigated</span>
                  <span className="detail-item">Priority flag cleared</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-outline btn-sm btn">Export</button>
              </div>
            </div>
            <div className="skipped transaction-card">
              <div className="transaction-header">
                <div className="transaction-status">
                  <svg
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
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
                  <span className="status-text">Skipped</span>
                </div>
                <span className="transaction-time">07:30</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-01 → Bin B-011</h4>
                <div className="transaction-details">
                  <span className="detail-item">Access blocked</span>
                  <span className="detail-item">Follow-up required</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-sm btn btn-primary">Reassign</button>
              </div>
            </div>
            <div className="pending transaction-card">
              <div className="transaction-header">
                <div className="transaction-status">
                  <svg
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
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
                  <span className="status-text">Pending</span>
                </div>
                <span className="transaction-time">06:15</span>
              </div>
              <div className="transaction-content">
                <h4 className="transaction-title">Truck T-09 → Bin B-178</h4>
                <div className="transaction-details">
                  <span className="detail-item">En route</span>
                  <span className="detail-item">ETA: 12 min</span>
                </div>
              </div>
              <div className="transaction-actions">
                <button className="btn-outline btn-sm btn">Track</button>
              </div>
            </div>
          </div>
          <div className="transactions-footer">
            <div className="filter-actions">
              <select className="filter-select">
                <option>All Transactions</option>
                <option>Collected</option>
                <option>Failed</option>
                <option>Partial</option>
                <option>Pending</option>
              </select>
              <button className="btn-outline btn">Export CSV</button>
              <button className="btn-secondary btn">Create Report</button>
            </div>
          </div>
        </div>
      </section>
      <section id="faq-guidance" className="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <h2 className="section-title">FAQ &amp; Guidance</h2>
            <p className="section-subtitle">
              {" "}
              Essential operational guidance and troubleshooting for city
              administrators
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">How to prioritize alerts?</h4>
              <p className="faq-answer">
                {" "}
                Quick triage: Treat Overflow and Full alerts as immediate action
                items. Assign nearest Available truck within 15 minutes using
                the Truck Scheduling panel. Use Route Optimization to bundle
                nearby Full bins into a single detour to reduce fuel and time.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                Interpreting fill-level indicators
              </h4>
              <p className="faq-answer">
                {" "}
                Read progress bars as operational thresholds: Empty (0–20%),
                Half (21–60%), Full (61–90%), Overflow (91–100%). Configure
                alert sensitivities in Settings for early warning or aggressive
                collection based on neighborhood risk profiles.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Responding to urgent bins</h4>
              <p className="faq-answer">
                {" "}
                Fast response workflow: Open the bin on the Map view, confirm
                last-service timestamp, then create a scheduled pickup from the
                Bin detail card. Mark the assignment in Transactions &amp;
                Safety to maintain audit trail and compliance records.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Managing fleet readiness</h4>
              <p className="faq-answer">
                {" "}
                Daily checklist: Verify each truck&apos;s status in the active
                trucks list before peak hours. Prioritize trucks marked
                Available with recent maintenance records. Use the schedule view
                to reserve backup units for high-density routes.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Using route suggestions safely</h4>
              <p className="faq-answer">
                {" "}
                Validation step: Treat optimized routes as prescriptive
                recommendations. Cross-check route with real-time road closures
                or maintenance notes in the Route Optimization panel before
                dispatching to ensure safety and regulatory compliance.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">Landfill capacity planning</h4>
              <p className="faq-answer">
                {" "}
                Proactive thresholds: Monitor landfill usage trends and set
                alerts at 70% and 90% capacity. Initiate contingency plans
                (temporary holding sites, increased pickup frequency) when the
                70% threshold is breached to avoid service disruption.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
      <a href="https://play.teleporthq.io/signup">
        <div aria-label="Sign up to TeleportHQ" className="home-container8">
          <svg
            width="24"
            height="24"
            viewBox="0 0 19 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="home-icon102"
          >
            <path
              d="M9.1017 4.64355H2.17867C0.711684 4.64355 -0.477539 5.79975 -0.477539 7.22599V13.9567C-0.477539 15.3829 0.711684 16.5391 2.17867 16.5391H9.1017C10.5687 16.5391 11.7579 15.3829 11.7579 13.9567V7.22599C11.7579 5.79975 10.5687 4.64355 9.1017 4.64355Z"
              fill="#B23ADE"
            ></path>
            <path
              d="M10.9733 12.7878C14.4208 12.7878 17.2156 10.0706 17.2156 6.71886C17.2156 3.3671 14.4208 0.649963 10.9733 0.649963C7.52573 0.649963 4.73096 3.3671 4.73096 6.71886C4.73096 10.0706 7.52573 12.7878 10.9733 12.7878Z"
              fill="#FF5C5C"
            ></path>
            <path
              d="M17.7373 13.3654C19.1497 14.1588 19.1497 15.4634 17.7373 16.2493L10.0865 20.5387C8.67402 21.332 7.51855 20.6836 7.51855 19.0968V10.5141C7.51855 8.92916 8.67402 8.2807 10.0865 9.07221L17.7373 13.3654Z"
              fill="#2874DE"
            ></path>
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Home;
