import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import AdminDashboard from "./pages/admin-dashboard";
import StudentDashboard from "./pages/student-dashboard";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/admin-dashboard">
          <AdminDashboard />
        </Route>
        <Route path="/student-dashboard">
          <StudentDashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
