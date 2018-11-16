import React, { Component } from 'react';
import { getDisplayName } from '../../utlis';
import styles from './index.less';

export default WrappedComponent => class extends Component { // 全屏(fixed) 父级没有transform属性

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    render() {
        return (<div className={styles.wrapper}>
            <WrappedComponent {...this.props} />
        </div>)
    }
}