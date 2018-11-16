import React from 'react';
import { SearchBar } from 'antd-mobile';
import styles from './index.less';

export default ({ ...props }) => {
    const { onSearch = function () { }, placeholder = '', style = null, className = null } = props;
    return <SearchBar
        style={style}
        className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
        placeholder={placeholder}
        onSubmit={onSearch}
        onClear={onSearch}
    />
}