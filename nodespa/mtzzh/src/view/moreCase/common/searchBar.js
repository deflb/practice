import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'antd-mobile';
import styles from './searchBar.less';

export default class searchBar extends Component {
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
        const { placeholder, extra, onSearch } = this.props;
        return (
            <div className={styles.wrapper}>
                <SearchBar
                    className={styles.wrapper_search}
                    placeholder={placeholder}
                    onSubmit={onSearch}
                    onClear={onSearch}
                />
                {extra}
            </div>
        );
    }
}