import React from 'react';
import { WhiteSpace } from 'antd-mobile';
import styles from './index.less';

export default ({ ...props }) => {
    const { className = null } = props;
    return <WhiteSpace size='lg' {...props} className={className ? `${styles.wrapper} ${className}` : styles.wrapper} />
}