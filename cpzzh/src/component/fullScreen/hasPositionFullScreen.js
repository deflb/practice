import React, { Component } from 'react';
import { getDisplayName } from '../../utlis';
import styles from './hasPositionFullScreen.less';

export default WrappedComponent => class extends Component { // 全屏 父级已设置定位时使用

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    render() {
        return (<div className={styles.wrapper}>
            <WrappedComponent {...this.props} />
        </div>)
    }
}