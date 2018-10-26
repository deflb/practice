import React from 'react';
import styles from './index.less';

export default ({ ...props }) => {
    const { title = '', children } = props;
    return <ul className={styles.wrapper}>
        <li>{title}</li>
        <li>{children}</li>
    </ul>
}