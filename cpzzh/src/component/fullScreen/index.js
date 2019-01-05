import React, { Component } from 'react';
import { getDisplayName, isIOS } from '../../utlis';
import styles from './index.less';

export default WrappedComponent => class extends Component { // 全屏(fixed) 父级没有transform属性

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    render() {
        return (<div className={styles.wrapper}>
            {isIOS() ?
                <div style={{ height: 'calc(100% + 1px)' }}><WrappedComponent {...this.props} /></div>
                : <WrappedComponent {...this.props} />}
        </div>)
    }
}