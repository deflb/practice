import React from 'react';
import styles from './item.less';

export default ({ ...props }) => {
    // let { rowData } = props;
    return <div className={styles.wrapper}>
        <ul className={styles.wrapper_left}>
            <li className={styles.wrapper_left_title}>量尺评价</li>
            <li className={styles.wrapper_left_time}>2018-11-26 11:12:50</li>
        </ul>
        <span className={styles.wrapper_right}>+100</span>
    </div>
}