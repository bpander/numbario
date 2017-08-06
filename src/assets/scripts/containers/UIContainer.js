import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';

@connect(state => state)
export default class UIContainer extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user;
  }

  render() {
    return (
      <div>
        UI
      </div>
    );
  }
}
