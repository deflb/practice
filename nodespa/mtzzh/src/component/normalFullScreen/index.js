import React, { Component } from 'react';
import { getDisplayName } from '../../utlis';
import styles from './index.less';

export default WrappedComponent => class extends Component { // 父级没有transform属性下使用

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    render() {
        return (<div className={styles.wrapper}>
            <WrappedComponent {...this.props} />
        </div>)
    }
}