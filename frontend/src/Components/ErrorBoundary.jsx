import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

/**
 * Error Boundary Component
 * Catches errors and displays user-friendly error UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log to external service (optional)
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <FiAlertTriangle className="text-3xl text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-center text-gray-600 mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
                <summary className="font-semibold text-gray-700 cursor-pointer mb-2">
                  Error Details
                </summary>
                <div className="text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                  <p>
                    <strong>Error:</strong>{" "}
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <p>
                      <strong>Stack:</strong>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </p>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <FiRefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
