import { Suspense, lazy } from 'react'
import { LoaderCard } from './Loader'

// Higher-order component for lazy loading with loading fallback
export function withLazyLoading(importFunc, fallback = null) {
  const LazyComponent = lazy(importFunc)
  
  return function WrappedComponent(props) {
    return (
      <Suspense fallback={fallback || <LoaderCard message="Loading component..." />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Utility for creating lazy components with custom loading states
export function createLazyComponent(importFunc, loadingMessage = "Loading...") {
  return lazy(importFunc)
}

export default withLazyLoading
