import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';

@connect(state => state)
export default class FooterContainer extends Component {
  render() {
    return (
      <ul className="hList hList--3x">
        <li>
          <button className="bubble">
          </button>
        </li>
        <li>
          <button className="bubble">
          </button>
        </li>
        <li>
          <button className="bubble">
          </button>
        </li>
      </ul>
    );
  }
}
