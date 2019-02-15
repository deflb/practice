import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class iconFixedPage extends Component {
    static propTypes = {
        onAdd: PropTypes.func,
    }
    static defaultProps = {
        onAdd: function () { }
    }
    render() {
        let { children, onAdd } = this.props;
        return (<React.Fragment>
            {children}
            <i className={styles.add_icon} onClick={onAdd} />
        </React.Fragment>)
    }
}