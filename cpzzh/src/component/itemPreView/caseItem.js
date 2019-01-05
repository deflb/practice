import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import whichImgLink from '../../utlis/whichImgLink';
import styles from './index.less';

export default class caseItem extends Component {
    static propTypes = {
        rowClick: PropTypes.func, // 整行点击处理
        rowData: PropTypes.object, // 案例有关字段
        updateLikeCount: PropTypes.func, // 更新点赞数
    }

    static defaultProps = {
        rowClick: function () { },
        rowData: {},
        updateLikeCount: function () { }
    }

    onLikes = e => { // 点赞
        e.stopPropagation();
        const { rowData, updateLikeCount } = this.props;
        request({ url: api.saveLikes, data: { id: rowData.id, status: 1 } }).then(res => {
            Toast.success(res, 0.7);
            // 更新点赞数
            updateLikeCount()
        }).catch(err => { })
    }

    render() {
        const { rowData, style = null, className = null, rowClick } = this.props,
            { surfacePlotUrl, title, styleName, buildName, views, comments, likes } = rowData;
        return <ul className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style} onClick={rowClick}>
            <li className={styles.wrapper_image}>
                {surfacePlotUrl ? <img src={whichImgLink(surfacePlotUrl)} alt={title} /> : null}
            </li>
            <li className={styles.wrapper_content}>
                <p className={styles.wrapper_content_title}>{title}</p>
                {styleName ? <div className={styles.wrapper_content_des}>
                    {buildName + ' ' + styleName}{styleName}
                </div> : null}
                <ul className={styles.wrapper_content_footer}>
                    <li><i className='iconfont icon-chakan' />{views}</li>
                    <li><i className='iconfont icon-xiaoxi' />{comments}</li>
                    <li onClick={this.onLikes}><i className='iconfont icon-i-good' />{likes}</li>
                </ul>
            </li>
        </ul>
    }
}