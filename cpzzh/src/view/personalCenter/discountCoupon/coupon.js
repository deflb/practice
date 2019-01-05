import React from 'react';
import { formatDate } from '../../../utlis';
import stale_icon from '../../../assets/icon/stale_icon@3x.png';
import used_icon from '../../../assets/icon/used_icon@3x.png';
import coupon_green_icon from '../../../assets/icon/coupon_green_icon@3x.png';
import coupon_grey_icon from '../../../assets/icon/coupon_grey_icon@3x.png';
import styles from './coupon.less';

export default ({ rowData }) => (<div className={styles.wrapper}>
    <ul className={rowData.statusStr === '未使用' || rowData.statusStr === '未开始' ? styles.left : `${styles.left} ${styles.disabled}`}>
        <li className={styles.left_name}>{rowData.couponName}</li>
        <li className={styles.left_type}>{rowData.typeName}</li>
        <li className={styles.left_date}>有效期：{formatDate(rowData.effectiveDate)} - {formatDate(rowData.expireDate)}</li>
    </ul>
    <div className={styles.right}>
        <img src={rowData.statusStr === '未使用' || rowData.statusStr === '未开始' ? coupon_green_icon : coupon_grey_icon} alt='' />
        <div className={rowData.statusStr === '未使用' || rowData.statusStr === '未开始' ? null : styles.disabled}>￥<span>{rowData.discountAmount}</span></div>
    </div>
    {rowData.statusStr === '未使用' || rowData.statusStr === '未开始' ? null : <img src={rowData.statusStr === '已过期' ? stale_icon : used_icon} className={styles.extra} alt='' />}
</div>)