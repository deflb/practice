import React from 'react';
import styles from './index.less';

export default ({ className, style }) => <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style} />