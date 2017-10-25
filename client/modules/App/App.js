import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import HomeContent from './components/HomeContent/HomeContent';
import Footer from './components/Footer/Footer';
import Dashboard from './components/User/Dashboard/Dashboard';

// Import Actions
import { toggleAddPost } from './AppActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false, loggedIn: false };

    this.toggleLogIn = this.toggleLogIn.bind(this);
  }

  componentDidMount() {
    this.setState({isMounted: true});
  }

  toggleLogIn() {
    console.log("called");
    this.setState({loggedIn: !this.state.loggedIn});
  }

  render() {
    var view;
    if (this.state.loggedIn)
      view = <Dashboard />;
    else
      view = <HomeContent loginHandler={this.toggleLogIn}/>;

    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="Media Bin"
            titleTemplate="%s"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <Header loggedIn={this.state.loggedIn} loginHandler={this.toggleLogIn} />

          <div className="container-fluid">
            {view}
          </div>
          
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps)(App);
