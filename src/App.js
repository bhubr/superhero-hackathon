import React, { Component } from "react";
import { connect } from "react-redux";
import heroes from "./data/heroes.json";
import ChooseMode from "./components/ChooseMode";
import ChoosePlayer from "./components/ChoosePlayer";
import Arena from "./components/Arena";
import steps from './data/steps';

const EmptyComponent = () => <h1 style={{textAlign: 'center'}}>Empty Component :/</h1>;

const components = {
  [steps.CHOOSE_MODE]: ChooseMode,
  [steps.CHOOSE_PLAYER1]: ChoosePlayer,
  [steps.CHOOSE_PLAYER2]: ChoosePlayer,
  [steps.PLAY]: Arena
};

class App extends Component {
  getComponent() {
    const { step } = this.props;
    return components[step];
  }
  render() {
    const Component = this.getComponent() || EmptyComponent;
    return <div className="App"><Component /></div>;
  }
}

const mapStateToProps = state => ({
  step: state.step
});

export default connect(mapStateToProps)(App);
