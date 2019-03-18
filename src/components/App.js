import React from 'react';
import PropTypes from 'prop-types';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Provider} from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';

const ContextType = {
  insertCss: PropTypes.func.isRequired,
  store: PropTypes.object,
};

class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  content = () => {
    return (
      <StyleContext.Provider value={{insertCss: this.props.context.insertCss}}>
        <LocaleProvider locale={zhCN}>
          {React.Children.only(this.props.children)}
        </LocaleProvider>
      </StyleContext.Provider>
    );
  };

  render() {
    const {store} = this.props.context;
    if (store) {
      return <Provider store={store}>{this.content()}</Provider>;
    } else {
      return this.content();
    }
  }
}

export default App;
