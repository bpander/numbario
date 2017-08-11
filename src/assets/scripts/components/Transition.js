import Inferno from 'inferno';
import Component from 'inferno-component';
import { createSelector } from 'reselect';

export default class Transition extends Component {

  static ENTERING = 0;
  static ENTERED = 1;
  static LEAVING = 2;

  static defaultProps = {
    items: [],
    component: 'div',
    children: () => {},
  };

  static itemDefaults = {
    state: Transition.ENTERING,
    key: '',
    data: null,
    leaveTimeout: 0,
  };

  static getKeyToIndexMap = createSelector(
    [ items => items ],
    items => items.reduce((map, item, i) => ({ ...map, [item.key]: i }), {}),
  );

  constructor(props) {
    super(props);

    this.state = {
      items: props.items.map(item => ({
        ...Transition.itemDefaults,
        ...item,
      })),
    };
  }

  componentWillReceiveProps(nextProps) {
    // Create new items or update existing ones
    const oldKeyToIndexMap = Transition.getKeyToIndexMap(this.state.items);
    const leftoversMap = { ...oldKeyToIndexMap };
    const items = nextProps.items.map(propItem => {
      const oldIndex = oldKeyToIndexMap[propItem.key];
      delete leftoversMap[propItem.key];
      let oldItem = this.state.items[oldIndex];
      if (oldItem == null) {
        return { ...Transition.itemDefaults, ...propItem };
      }
      if (oldItem.state === Transition.LEAVING) {
        oldItem = { ...oldItem, state: Transition.ENTERED };
      }
      return { ...oldItem, ...propItem };
    });

    // Splice in leaving items
    const oldIndexes = Object.values(leftoversMap);

    // Start from the highest index since we'll be inserting items
    oldIndexes.sort().reverse();

    oldIndexes.forEach(index => {
      let itemToRemove = this.state.items[index];

      // Queue the item for removal if not already done so
      if (itemToRemove.state !== Transition.LEAVING) {
        itemToRemove = { ...itemToRemove, state: Transition.LEAVING };
        this.removeLater(itemToRemove);
      }
      items.splice(index, 0, itemToRemove);
    });

    this.setState({ items });
  }

  onAnimationFrame = () => {
    let hasNewItem = false;
    const items = this.state.items.map(item => {
      if (item.state === Transition.ENTERING) {
        hasNewItem = true;
        return { ...item, state: Transition.ENTERED };
      }
      return item;
    });

    if (hasNewItem) {
      this.setState({ items });
    }
  };

  removeLater(item) {
    const { key, leaveTimeout } = item;
    setTimeout(() => {
      // Get latest data for item
      const itemToRemove = this.state.items.find(item => item.key === key);

      // Check if it still wants to be deleted
      if (itemToRemove.state !== Transition.LEAVING) {
        return;
      }

      // Proceed with deletion
      const indexToRemove = this.state.items.indexOf(itemToRemove);
      const items = [ ...this.state.items ];
      items.splice(indexToRemove, 1);
      this.setState({ items });
    }, leaveTimeout);
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { items, component, children, ...rest } = this.props;
    setTimeout(this.onAnimationFrame, 17); // TODO: Why does RAF not work sometimes?
    return <this.props.component {...rest}>{children(this.state.items)}</this.props.component>;
  }
}
