import React from 'react';
import styles from './title.less';

export default ({ ...props }) => {
    let { title } = props;
    return <div className={styles.wrapper}>{title}</div>
}