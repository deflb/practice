import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgAddress } from '../../request/baseURL';
import styles from './index.less';

export default class textMaskImageBox extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        rowData: PropTypes.object, // {imgUrl,title}
    }

    static defaultProps = {
        onClick: function () { },
        rowData: {}
    }

    render() {
        const { onClick, rowData, style = null, className = null } = this.props,
            { title, imgUrl } = rowData;
        return <div onClick={onClick} className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style}>
            <div className={styles.wrapper_img}>{imgUrl ? <img src={imgAddress + imgUrl} alt={title} /> : null}</div>
            <div className={styles.wrapper_title}>{title || '　'}</div>
        </div>
    }
}