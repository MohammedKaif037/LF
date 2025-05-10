// Enable client-side rendering for Next.js or similar frameworks
"use client"

// Inspired by the popular 'react-hot-toast' library
import * as React from "react"

// Import custom type definitions for toast props and actions
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Max number of toasts to display at once
const TOAST_LIMIT = 1

// Delay before a toast is removed from memory (ms)
const TOAST_REMOVE_DELAY = 1000000 // very long for demo/testing

// Type for a single toast object
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Toast action types (used in reducer)
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Global counter to generate unique toast IDs
let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Type-safe version of ActionType based on the object above
type ActionType = typeof actionTypes

// Union type for all actions dispatched to the reducer
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

// Toast state contains a list of active toasts
interface State {
  toasts: ToasterToast[]
}

// Holds timeout IDs for each toast to be removed later
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Adds a toast to the removal queue after a delay
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer function to handle toast state updates
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Prepend new toast and limit number of active toasts
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        // Update toast by ID with new values
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Add toast(s) to removal queue
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }

      return {
        ...state,
        // Close the targeted toast(s)
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Remove all toasts
        return { ...state, toasts: [] }
      }
      // Remove specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Stores all functions that listen to state updates
const listeners: Array<(state: State) => void> = []

// Global toast state in memory
let memoryState: State = { toasts: [] }

// Dispatch function to update global state and notify listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

// Type for creating a new toast (without ID)
type Toast = Omit<ToasterToast, "id">

// Function to create and show a toast
function toast({ ...props }: Toast) {
  const id = genId() // Generate unique ID

  // Update function for toast
  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })

  // Dismiss function for toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Add new toast to the state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return { id, dismiss, update }
}

// React hook to use the toast system in components
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  // Subscribe to state changes when component mounts
  React.useEffect(() => {
    listeners.push(setState)

    // Cleanup listener when component unmounts
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state, // current toasts
    toast,    // function to show toast
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }), // dismiss toast
  }
}

// Export hook and toast function
export { useToast, toast }
