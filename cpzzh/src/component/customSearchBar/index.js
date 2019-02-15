import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'antd-mobile';
import styles from './index.less';

export default class customSearchBar extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        extra: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        onSearch: PropTypes.func,
    }
    static defaultProps = {
        placeholder: '',
        extra: null,
        onSearch: function () { }
    }

    render() {
        const { placeholder, extra, onSearch, className, style } = this.props;
        return extra ? (<div className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style}>
            <SearchBar
                className={styles.search}
                placeholder={placeholder}
                onSubmit={onSearch}
                onClear={onSearch}
            />{extra}
        </div>) : (<SearchBar
            className={className ? `${styles.search} ${className}` : styles.search} style={style}
            placeholder={placeholder}
            onSubmit={onSearch}
            onClear={onSearch}
        />)
    }
}