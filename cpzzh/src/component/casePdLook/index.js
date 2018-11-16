import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import { imgAddress } from '../../request/baseURL';
import styles from './index.less';

export default class casePdLook extends Component {
    static propTypes = {
        rowClick: PropTypes.func, // 整行点击处理
        rowData: PropTypes.object, // {index, id, surfacePlotUrl, title, styleName, views, comments, likes}
        updateCurrentItem: PropTypes.func, // 父组件更新
    }

    static defaultProps = {
        rowClick: function () { },
        rowData: {},
        updateCurrentItem: function () { }
    }

    onLikes = e => { // 点赞
        e.stopPropagation();
        const { rowData, updateCurrentItem } = this.props;
        request({ url: api.saveLikes, data: { id: rowData.id, status: 1 } }).then(res => {
            Toast.success(res, 0.7);
            // 更新点赞数
            updateCurrentItem('likes', rowData.index)
        }).catch(err => { })
    }

    render() {
        const { rowData, style = null, className = null, rowClick } = this.props,
            { surfacePlotUrl, title, styleName, views, comments, likes } = rowData;
        return <ul className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style} onClick={rowClick}>
            <li className={styles.wrapper_image}>
                {surfacePlotUrl ? <img src={imgAddress + surfacePlotUrl} alt={title} /> : null}
            </li>
            <li className={styles.wrapper_content}>
                <p className={styles.wrapper_content_title}>{title}</p>
                <p className={styles.wrapper_content_des}>{styleName}</p>
                <ul className={styles.wrapper_content_footer}>
                    <li><i className='iconfont icon-chakan' />{views}</li>
                    <li><i className='iconfont icon-xiaoxi' />{comments}</li>
                    <li onClick={this.onLikes}><i className='iconfont icon-i-good' />{likes}</li>
                </ul>
            </li>
        </ul>
    }
}