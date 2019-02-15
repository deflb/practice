import React from 'react';
import { isIOS } from '../../utlis';
import styles from './index.less';

export default ({ ...props }) => {
    let { children, className, style } = props;
    return <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style}>
        {isIOS() ? <div style={{ minHeight: 'calc(100% + 1px)' }}>
            {children}
        </div> : children}
    </div>
}