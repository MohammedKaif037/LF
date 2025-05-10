// Import all of React's exports, such as useState and useEffect
import * as React from "react"

// Define a constant that sets the breakpoint for mobile screens (768px)
const MOBILE_BREAKPOINT = 768

// Custom hook to determine if the current screen size is considered "mobile"
export function useIsMobile() {
  // State to store whether the screen is mobile-sized
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // useEffect runs once when the component using this hook mounts
  React.useEffect(() => {
    // Create a MediaQueryList object to track screen size changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Handler function to update isMobile when screen size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add an event listener to track screen size changes
    mql.addEventListener("change", onChange)

    // Set the initial value of isMobile based on current screen width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup the event listener when the component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return a boolean value; fallback to false if isMobile is undefined
  return !!isMobile
}
