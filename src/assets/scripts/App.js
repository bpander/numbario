import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions/actions';

const mapStateToProps = state => {
  return { didFoo: state.didFoo };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  componentDidMount() {
    this.props.actions.foo();
  }

  render() {
    const { didFoo } = this.props;
    return (
      <div>
      </div>
    );
  }
};
