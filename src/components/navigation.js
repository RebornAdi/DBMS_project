import React from 'react'

import Script from 'dangerous-html/react'

import './navigation.css'

const Navigation = (props) => {
  return (
    <div className="navigation-container1">
      <div className="navigation-container2">
        <div className="navigation-container3">
          <Script
            html={`<style>
@media (prefers-reduced-motion: reduce) {
.navigation-header, .navigation-logo, .navigation-logo-icon, .navigation-link, .navigation-mobile-toggle, .navigation-mobile-menu, .navigation-mobile-panel, .navigation-mobile-link {
  transition: none;
}
.navigation-logo:hover, .navigation-link:hover, .navigation-mobile-link:hover {
  transform: none;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="navigation-container4">
        <div className="navigation-container5">
          <Script
            html={`<script defer data-name="navigation">
(function(){
  const mobileToggle = document.getElementById("navigation-mobile-toggle")
  const mobileMenu = document.getElementById("navigation-mobile-menu")
  const mobileBackdrop = mobileMenu.querySelector(".navigation-mobile-backdrop")
  const body = document.body

  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.contains("active")

    if (isActive) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.add("active")
    mobileToggle.classList.add("active")
    mobileToggle.setAttribute("aria-expanded", "true")
    body.style.overflow = "hidden"

    // Focus trap
    const firstFocusableElement = mobileMenu.querySelector("a, button")
    if (firstFocusableElement) {
      setTimeout(() => firstFocusableElement.focus(), 100)
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("active")
    mobileToggle.classList.remove("active")
    mobileToggle.setAttribute("aria-expanded", "false")
    body.style.overflow = ""
    mobileToggle.focus()
  }

  // Toggle menu on button click
  mobileToggle.addEventListener("click", toggleMobileMenu)

  // Close menu on backdrop click
  mobileBackdrop.addEventListener("click", closeMobileMenu)

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMobileMenu()
    }
  })

  // Close menu when clicking on mobile links
  const mobileLinks = mobileMenu.querySelectorAll(".navigation-mobile-link")
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Handle active states based on current page
  function setActiveNavigation() {
    const currentPath = window.location.pathname
    const allLinks = document.querySelectorAll(
      ".navigation-link, .navigation-mobile-link"
    )

    allLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active")
      }
    })
  }

  // Set active navigation on load
  setActiveNavigation()

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991 && mobileMenu.classList.contains("active")) {
      closeMobileMenu()
    }
  })

  // Smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerHeight =
          document.querySelector(".navigation-header").offsetHeight
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
})()
</script>`}
          ></Script>
        </div>
      </div>
      <nav className="navigation-header">
        <div className="navigation-container">
          <div className="navigation-brand">
            <a href="/">
              <div
                aria-label="WasteWise Dashboard Home"
                className="navigation-logo"
              >
                <div className="navigation-logo-icon">
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
                <span className="navigation-logo-text">
                  WasteWise Dashboard
                </span>
              </div>
            </a>
          </div>
          <div className="navigation-menu-desktop">
            <ul className="navigation-list">
              <li className="navigation-item">
                <a href="/bin-management">
                  <div className="navigation-link">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
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
                    <span>Bin Management</span>
                  </div>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/truck-scheduling">
                  <div className="navigation-link">
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
                    <span>Truck Scheduling</span>
                  </div>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/route-optimization">
                  <div className="navigation-link">
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
                    <span>Route Optimization</span>
                  </div>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/landfill-management">
                  <div className="navigation-link">
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
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
                    <span>Landfill Management</span>
                  </div>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/reports">
                  <div className="navigation-link">
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
                        <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                        <path d="m19 9l-5 5l-4-4l-3 3"></path>
                      </g>
                    </svg>
                    <span>Reports</span>
                  </div>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/settings">
                  <div className="navigation-link">
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
                    <span>Settings</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <button
            id="navigation-mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            className="navigation-mobile-toggle"
          >
            <svg
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              className="navigation-hamburger-icon"
            >
              <path
                d="M4 5h16M4 12h16M4 19h16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <svg
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              className="navigation-navigation-close-icon"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        <div id="navigation-mobile-menu" className="navigation-mobile-menu">
          <div className="navigation-mobile-backdrop"></div>
          <div className="navigation-mobile-panel">
            <div className="navigation-mobile-header">
              <div className="navigation-mobile-logo">
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
                <span>WasteWise Dashboard</span>
              </div>
            </div>
            <nav className="navigation-mobile-nav">
              <ul className="navigation-mobile-list">
                <li className="navigation-mobile-item">
                  <a href="/bin-management">
                    <div className="navigation-mobile-link">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
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
                      <span>Bin Management</span>
                    </div>
                  </a>
                </li>
                <li className="navigation-mobile-item">
                  <a href="/truck-scheduling">
                    <div className="navigation-mobile-link">
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
                      <span>Truck Scheduling</span>
                    </div>
                  </a>
                </li>
                <li className="navigation-mobile-item">
                  <a href="/route-optimization">
                    <div className="navigation-mobile-link">
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
                      <span>Route Optimization</span>
                    </div>
                  </a>
                </li>
                <li className="navigation-mobile-item">
                  <a href="/landfill-management">
                    <div className="navigation-mobile-link">
                      <svg
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
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
                      <span>Landfill Management</span>
                    </div>
                  </a>
                </li>
                <li className="navigation-mobile-item">
                  <a href="/reports">
                    <div className="navigation-mobile-link">
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
                          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                          <path d="m19 9l-5 5l-4-4l-3 3"></path>
                        </g>
                      </svg>
                      <span>Reports</span>
                    </div>
                  </a>
                </li>
                <li className="navigation-mobile-item">
                  <a href="/settings">
                    <div className="navigation-mobile-link">
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
                      <span>Settings</span>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navigation
