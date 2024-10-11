import React from 'react';
import Message from './Message';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops! Something went wrong.</h1>
          <Message type="error">
            {this.state.error && this.state.error.toString()}
          </Message>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
