import React, { Component } from 'react'
import MyFarm from './MyFarm'
import Navbar from './Navbar'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/my-farm">
              <MyFarm />
            </Route>
            <Route path="/collective">
              <MyFarm />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
