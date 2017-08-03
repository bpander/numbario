import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbersActions from 'actions/numbersActions';


@connect(state => state)
export default class App extends Component {

  componentDidMount() {
    const { difficulty } = this.props.user;
    this.props.dispatch(numbersActions.newGame(difficulty));
  }

  render() {
    const { didFoo } = this.props;
    return (
      <div>
      </div>
    );
  }
};
