import React from 'react';
import { isIOS } from '../../utlis';
import styles from './index.less';

export default ({ ...props }) => {
    let { children } = props;
    return <div className={styles.wrapper}>
        {isIOS() ? <div style={{ minHeight: 'calc(100% + 1px)' }}>
            {children}
        </div> : children}
    </div>
}