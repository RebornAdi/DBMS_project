import React from 'react'

import Script from 'dangerous-html/react'

import './footer.css'

const Footer = (props) => {
  return (
    <div className="footer-container1">
      <div className="footer-container2">
        <div className="footer-container3">
          <Script
            html={`<style>
        @keyframes footer-fade-in {to {opacity: 1;
transform: translateY(0);}}
        </style> `}
          ></Script>
        </div>
      </div>
      <div className="footer-container4">
        <div className="footer-container5">
          <Script
            html={`<style>
@media (prefers-reduced-motion: reduce) {
.footer-certification-badge, .footer-social-link {
  animation: none;
  opacity: 1;
  transform: none;
}
.footer-certification-badge:hover, .footer-social-link:hover {
  transform: none;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="footer-container6">
        <div className="footer-container7">
          <Script
            html={`<script defer data-name="footer-interactions">
(function(){
  // Enhanced footer interactions
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const badges = entry.target.querySelectorAll(
            ".footer-certification-badge, .footer-social-link"
          )
          badges.forEach((badge, index) => {
            setTimeout(() => {
              badge.style.animationPlayState = "running"
            }, index * 100)
          })
        }
      })
    },
    { threshold: 0.2 }
  )

  const footer = document.querySelector(".footer-main")
  if (footer) {
    footerObserver.observe(footer)
  }

  // Smooth scroll for footer links
  const footerNavLinks = document.querySelectorAll(
    '.footer-nav-link[href^="#"]'
  )
  footerNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Contact information copy functionality
  const contactItems = document.querySelectorAll(".footer-contact-item")
  contactItems.forEach((item) => {
    const text = item.querySelector("span")
    if (
      text &&
      (text.textContent.includes("@") || text.textContent.includes("+"))
    ) {
      item.style.cursor = "pointer"
      item.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(text.textContent)

          // Visual feedback
          const originalText = text.textContent
          text.textContent = "Copied!"
          text.style.color = "var(--color-primary)"

          setTimeout(() => {
            text.textContent = originalText
            text.style.color = ""
          }, 1500)
        } catch (err) {
          console.log("Copy failed:", err)
        }
      })
    }
  })

  // Social link tracking (placeholder for analytics)
  const socialLinks = document.querySelectorAll(".footer-social-link")
  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const platform = link.getAttribute("aria-label")
      console.log(\`Social link clicked: \${platform}\`)
      // Add analytics tracking here
    })
  })

  // Enhanced accessibility for keyboard navigation
  const focusableElements = document.querySelectorAll(
    ".footer-nav-link, .footer-legal-link, .footer-social-link"
  )
  focusableElements.forEach((element) => {
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        element.click()
      }
    })
  })
})()
</script>`}
          ></Script>
        </div>
      </div>
      <footer className="footer-main">
        <div className="footer-background-container">
          <div className="footer-background-image"></div>
          <div className="footer-overlay"></div>
        </div>
        <div className="footer-content-wrapper">
          <div className="footer-primary-section">
            <div className="footer-brand-column">
              <div className="footer-brand-header">
                <div className="footer-logo-container">
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
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881a1.79 1.79 0 0 1-.004-1.784L7.196 9.5M11 19h8.203a1.83 1.83 0 0 0 1.556-.89a1.78 1.78 0 0 0 0-1.775l-1.226-2.12"></path>
                      <path d="m14 16l-3 3l3 3m-5.707-8.404L7.196 9.5L3.1 10.598m6.244-4.787l1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.78 1.78 0 0 1 1.546.888l3.943 6.843"></path>
                      <path d="m13.378 9.633l4.096 1.098l1.097-4.096"></path>
                    </g>
                  </svg>
                  <h3 className="footer-brand-name">WasteWise Dashboard</h3>
                </div>
                <p className="footer-brand-tagline">
                  {' '}
                  Smart solutions for sustainable city management
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </p>
              </div>
              <div className="footer-contact-info">
                <div className="footer-contact-item">
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
                      <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                      <rect x="2" y="4" rx="2" width="20" height="16"></rect>
                    </g>
                  </svg>
                  <span>contact@wastewise.com</span>
                </div>
                <div className="footer-contact-item">
                  <svg
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="footer-contact-item">
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
                  <span>1234 Industrial Way, Tech City, TC 12345</span>
                </div>
              </div>
            </div>
            <div className="footer-navigation-columns">
              <div className="footer-nav-column">
                <h4 className="footer-nav-header">Platform</h4>
                <nav className="footer-nav-links">
                  <a href="#homepage">
                    <div className="footer-nav-link">
                      <span>Dashboard Overview</span>
                    </div>
                  </a>
                  <a href="#bin-management">
                    <div className="footer-nav-link">
                      <span>Bin Management</span>
                    </div>
                  </a>
                  <a href="#truck-scheduling">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Truck Scheduling
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                  <a href="#route-optimization">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Route Optimization
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                  <a href="#landfill-management">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Landfill Management
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                </nav>
              </div>
              <div className="footer-nav-column">
                <h4 className="footer-nav-header">Features</h4>
                <nav className="footer-nav-links">
                  <a href="#real-time-monitoring">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Real-Time Monitoring
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                  <a href="#analytics">
                    <div className="footer-nav-link">
                      <span>Analytics &amp; Reports</span>
                    </div>
                  </a>
                  <a href="#api-integration">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        API Integration
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                  <a href="#mobile-app">
                    <div className="footer-nav-link">
                      <span>Mobile Application</span>
                    </div>
                  </a>
                  <a href="#notifications">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Smart Notifications
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                </nav>
              </div>
              <div className="footer-nav-column">
                <h4 className="footer-nav-header">Support</h4>
                <nav className="footer-nav-links">
                  <a href="#documentation">
                    <div className="footer-nav-link">
                      <span>Documentation</span>
                    </div>
                  </a>
                  <a href="#help-center">
                    <div className="footer-nav-link">
                      <span>Help Center</span>
                    </div>
                  </a>
                  <a href="#training">
                    <div className="footer-nav-link">
                      <span>Training Resources</span>
                    </div>
                  </a>
                  <a href="#system-status">
                    <div className="footer-nav-link">
                      <span>System Status</span>
                    </div>
                  </a>
                  <a href="#contact-support">
                    <div className="footer-nav-link">
                      <span>
                        {' '}
                        Contact Support
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ' ',
                          }}
                        />
                      </span>
                    </div>
                  </a>
                </nav>
              </div>
              <div className="footer-nav-column">
                <h4 className="footer-nav-header">Company</h4>
                <nav className="footer-nav-links">
                  <a href="#about">
                    <div className="footer-nav-link">
                      <span>About Us</span>
                    </div>
                  </a>
                  <a href="#sustainability">
                    <div className="footer-nav-link">
                      <span>Sustainability</span>
                    </div>
                  </a>
                  <a href="#careers">
                    <div className="footer-nav-link">
                      <span>Careers</span>
                    </div>
                  </a>
                  <a href="#news">
                    <div className="footer-nav-link">
                      <span>News &amp; Updates</span>
                    </div>
                  </a>
                  <a href="#partnerships">
                    <div className="footer-nav-link">
                      <span>Partnerships</span>
                    </div>
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-secondary-section">
            <div className="footer-certifications">
              <div className="footer-certification-badge">
                <svg
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <span>ISO 14001 Certified</span>
              </div>
              <div className="footer-certification-badge">
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
                    <circle r="10" cx="12" cy="12"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"></path>
                  </g>
                </svg>
                <span>Carbon Neutral Platform</span>
              </div>
              <div className="footer-certification-badge">
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
                <span>Smart Fleet Solutions</span>
              </div>
            </div>
            <div className="footer-social-links">
              <a href="#linkedin">
                <div aria-label="LinkedIn" className="footer-social-link">
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
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"></path>
                      <circle r="2" cx="4" cy="4"></circle>
                    </g>
                  </svg>
                </div>
              </a>
              <a href="#twitter">
                <div aria-label="Twitter" className="footer-social-link">
                  <svg
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
              </a>
              <a href="#github">
                <div aria-label="GitHub" className="footer-social-link">
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
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </g>
                  </svg>
                </div>
              </a>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom-section">
            <div className="footer-legal-links">
              <a href="#privacy">
                <div className="footer-legal-link">
                  <span>Privacy Policy</span>
                </div>
              </a>
              <a href="#terms">
                <div className="footer-legal-link">
                  <span>Terms of Service</span>
                </div>
              </a>
              <a href="#cookies">
                <div className="footer-legal-link">
                  <span>Cookie Policy</span>
                </div>
              </a>
              <a href="#security">
                <div className="footer-legal-link">
                  <span>Security</span>
                </div>
              </a>
              <a href="#compliance">
                <div className="footer-legal-link">
                  <span>Compliance</span>
                </div>
              </a>
            </div>
            <div className="footer-copyright">
              <span>
                &amp;copy; 2025 WasteWise Dashboard. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
