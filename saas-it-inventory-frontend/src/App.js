import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import './styles/main.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/inventory" component={Inventory} />
                <Route path="/assets" component={Assets} />
                <Route path="/software-subscriptions" component={SoftwareSubscriptions} />
                <Route path="/reports" component={Reports} />
                <Route path="/profile" component={Profile} />
                <Route path="/help-support" component={HelpSupport} />
                <Route path="/user-management" component={UserManagement} />
                <Route path="/data-visualization" component={DataVisualization} />
                <Redirect to="/" />
              </Switch>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
