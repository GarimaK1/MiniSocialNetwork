import React, { Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import store from "./redux/store";
import { Provider } from 'react-redux';
import MyAlerts from "./components/layout/MyAlerts";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <MyNavbar />
          <Route exact path="/" component={Landing} />
          <Container fluid style={{ marginTop: '0.75rem' }}>
            <MyAlerts />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </Container>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;

{/* <Provider store={store}>
  <Router>
    <Fragment>
      <MyNavbar />
      <Route exact path="/" component={Landing} />
      <Container fluid style={{ width: '70%', marginTop: '0.75rem' }}>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Container>
    </Fragment>
  </Router>
</Provider> */}