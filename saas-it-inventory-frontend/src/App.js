import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Inventory from './components/Inventory';
import Assets from './components/Assets';
import SoftwareSubscriptions from './components/SoftwareSubscriptions';
import Reports from './components/Reports';
import Profile from './components/Profile';
import HelpSupport from './components/HelpSupport';
import UserManagement from './components/UserManagement';
import DataVisualization from './components/DataVisualization';
import NotFound from './components/NotFound';
import Loading from './components/Loading';
import './styles/main.css';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

const Layout = ({ children }) => (
  <div className="App">
    <Navigation />
    <div className="container">{children}</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Switch>
              <Route exact path="/login" component={Login} />
              <ProtectedRoute path="/dashboard" component={Dashboard} />
              <ProtectedRoute path="/inventory" component={Inventory} />
              <ProtectedRoute path="/assets" component={Assets} />
              <ProtectedRoute path="/software-subscriptions" component={SoftwareSubscriptions} />
              <ProtectedRoute path="/reports" component={Reports} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/help-support" component={HelpSupport} />
              <ProtectedRoute path="/user-management" component={UserManagement} />
              <ProtectedRoute path="/data-visualization" component={DataVisualization} />
              <Route path="/404" component={NotFound} />
              <Redirect exact from="/" to="/dashboard" />
              <Redirect to="/404" />
            </Switch>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
