import { useCallback, useEffect, useState } from 'react'

interface HighlightOptions {
  duration?: number
  message?: string
}

interface GuideStep {
  selector: string
  message: string
  nextSelector?: string
  nextMessage?: string
  delay?: number
}

export const useButtonHighlight = () => {
  const [activeGuide, setActiveGuide] = useState<GuideStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Custom function to find elements by text content
  const findElementByText = (selector: string): HTMLElement | null => {
    // Check if selector contains :contains()
    const containsMatch = selector.match(/^(.+):contains\("([^"]+)"\)$/)
    if (containsMatch) {
      const [, baseSelector, textContent] = containsMatch
      const elements = document.querySelectorAll(baseSelector)
      
      for (const element of elements) {
        if (element.textContent?.trim().toLowerCase().includes(textContent.toLowerCase())) {
          return element as HTMLElement
        }
      }
      return null
    }
    
    // Regular CSS selector
    try {
      return document.querySelector(selector) as HTMLElement
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error)
      return null
    }
  }

  // Custom function to check if element matches selector with text content
  const elementMatches = (element: HTMLElement, selector: string): boolean => {
    const containsMatch = selector.match(/^(.+):contains\("([^"]+)"\)$/)
    if (containsMatch) {
      const [, baseSelector, textContent] = containsMatch
      try {
        const matchesBase = element.matches(baseSelector)
        const hasText = element.textContent?.trim().toLowerCase().includes(textContent.toLowerCase())
        return matchesBase && !!hasText
      } catch (error) {
        return false
      }
    }
    
    // Regular CSS selector
    try {
      return element.matches(selector)
    } catch (error) {
      return false
    }
  }

  const highlightButton = useCallback((selector: string, options: HighlightOptions = {}) => {
    const { duration = 10000, message = "Click here" } = options
    
    // Find the button element using custom function
    const button = findElementByText(selector)
    if (!button) {
      console.warn(`Button with selector "${selector}" not found`)
      return
    }

    // Remove any existing highlight first
    button.classList.remove('ai-guide-highlight')
    const existingArrow = button.querySelector('.ai-guide-arrow')
    if (existingArrow) {
      existingArrow.remove()
    }

    // Add highlight class
    button.classList.add('ai-guide-highlight')
    
    // Add arrow indicator if message provided
    if (message) {
      const arrow = document.createElement('div')
      arrow.className = 'ai-guide-arrow'
      arrow.textContent = message
      button.style.position = 'relative'
      button.appendChild(arrow)
      
      // Remove arrow after duration
      setTimeout(() => {
        if (arrow.parentNode) {
          arrow.remove()
        }
      }, duration)
    }
    
    // Remove highlight after duration
    setTimeout(() => {
      button.classList.remove('ai-guide-highlight')
    }, duration)
    
    // Scroll button into view
    button.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
  }, [])

  const startInteractiveGuide = useCallback((steps: GuideStep[]) => {
    console.log('Starting interactive guide with steps:', steps)
    setActiveGuide(steps)
    setCurrentStepIndex(0)
    
    // Start with first step
    if (steps.length > 0) {
      highlightButton(steps[0].selector, { message: steps[0].message })
    }
  }, [highlightButton])

  const progressToNextStep = useCallback(() => {
    if (activeGuide.length === 0) return
    
    const nextIndex = currentStepIndex + 1
    console.log(`Progressing to step ${nextIndex} of ${activeGuide.length}`)
    
    if (nextIndex < activeGuide.length) {
      setCurrentStepIndex(nextIndex)
      const nextStep = activeGuide[nextIndex]
      
      // Add delay if specified
      setTimeout(() => {
        highlightButton(nextStep.selector, { message: nextStep.message })
      }, nextStep.delay || 1000)
    } else {
      // Guide completed
      console.log('Interactive guide completed')
      setActiveGuide([])
      setCurrentStepIndex(0)
    }
  }, [activeGuide, currentStepIndex, highlightButton])

  // Monitor page navigation and button clicks
  useEffect(() => {
    if (activeGuide.length === 0) return

    const currentStep = activeGuide[currentStepIndex]
    if (!currentStep) return

    console.log(`Monitoring for step: ${currentStep.message}`)

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement
      
      // Check if the clicked element matches current step selector
      const matchesDirectly = elementMatches(target, currentStep.selector)
      const targetElement = findElementByText(currentStep.selector)
      const containsTarget = targetElement?.contains(target) || false
      
      if (matchesDirectly || containsTarget) {
        console.log(`Guide step completed: ${currentStep.message}`)
        
        // Progress to next step after a short delay
        setTimeout(() => {
          progressToNextStep()
        }, 500)
      }
    }

    const handleNavigation = () => {
      // Check if we navigated to a page that should trigger next step
      const currentUrl = window.location.pathname
      console.log('Navigation detected:', currentUrl)
      
      if (currentUrl.includes('for-artists') && currentStepIndex === 0) {
        // User navigated to for-artists page, progress to next step
        setTimeout(() => {
          progressToNextStep()
        }, 1000)
      } else if (currentUrl.includes('events') && activeGuide.some(step => step.selector.includes('events'))) {
        // User navigated to events page
        setTimeout(() => {
          progressToNextStep()
        }, 1000)
      }
    }

    // Add event listeners
    document.addEventListener('click', handleClick, true)
    window.addEventListener('popstate', handleNavigation)
    
    // Check navigation immediately (for programmatic navigation)
    const observer = new MutationObserver(() => {
      setTimeout(handleNavigation, 100) // Small delay to ensure DOM updates
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', handleNavigation)
      observer.disconnect()
    }
  }, [activeGuide, currentStepIndex, progressToNextStep])

  const highlightMultipleButtons = useCallback((selectors: { selector: string; message: string; delay?: number }[]) => {
    console.log('Highlighting multiple buttons:', selectors)
    selectors.forEach(({ selector, message, delay = 0 }) => {
      setTimeout(() => {
        highlightButton(selector, { message })
      }, delay)
    })
  }, [highlightButton])

  return { highlightButton, highlightMultipleButtons, startInteractiveGuide }
}
