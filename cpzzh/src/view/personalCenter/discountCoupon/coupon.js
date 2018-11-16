import React from 'react';
import { formatDate } from '../../../utlis';
import styles from './coupon.less';

export default ({ ...props }) => {
    const { rowData } = props;
    return <div className={styles.coupon}>
        <ul className={styles.coupon_left}>
            <li className={styles.coupon_left_top}>￥ {rowData.discountAmount}</li>
            <li className={styles.coupon_left_bottom}>{rowData.couponName}</li>
        </ul>
        <ul className={styles.coupon_right}>
            <li className={styles.coupon_right_top}>{rowData.typeName}</li>
            <li className={styles.coupon_right_center}>{formatDate(new Date(rowData.effectiveDate))} - {formatDate(new Date(rowData.expireDate))}</li>
            <li className={styles.coupon_right_bottom}>
                {rowData.status === 0 ? null : <span role="button" aria-disabled="false" className={styles.coupon_right_bottom_btn}>立即使用</span>}
            </li>
            <li className={styles.coupon_right_tip} style={{ backgroundColor: rowData.status === 0 ? '#FF0000' : null }}>
                <span className={styles.coupon_right_tip_text}>{rowData.statusStr}</span>
            </li>
        </ul>
    </div>
}