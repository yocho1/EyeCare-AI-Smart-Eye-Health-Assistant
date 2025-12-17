/**
 * Custom hook for managing API calls with loading and error states
 */
import { useState, useCallback } from 'react'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (apiCall) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiCall
      return response.data
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || 'An error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { request, loading, error }
}
