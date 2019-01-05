import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import whichImgLink from '../../utlis/whichImgLink';
import CustomModal from '../customModal';
import styles from './index.less';
const { alert } = CustomModal;

export default class showHomeItem extends Component {
    static propTypes = {
        rowClick: PropTypes.func, // 整行点击处理
        rowData: PropTypes.object, // 晒家有关字段
        updateLikeCount: PropTypes.func, // 更新点赞数
    }

    static defaultProps = {
        rowClick: function () { },
        rowData: {},
        updateLikeCount: function () { }
    }

    viewReason = (message, e) => {
        e.stopPropagation();
        alert({
            message,
            actions: [
                { text: '关闭' }
            ]
        })
    }

    onLikes = e => { // 点赞
        e.stopPropagation();
        const { rowData, updateLikeCount } = this.props;
        request({ url: api.houseShowLike, data: { id: rowData.id } }).then(res => {
            Toast.success(res, 0.7);
            // 更新点赞数
            updateLikeCount()
        }).catch(err => { })
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }

    render() {
        const { rowData, style = null, className = null, rowClick } = this.props,
            { cover, title, viewCount, commentCount, likeCount, isLike, auditStatus, auditMsg } = rowData;
        return <ul className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style} onClick={rowClick}>
            <li className={styles.wrapper_image}>
                {cover ? <img src={whichImgLink(cover)} alt={title} /> : null}
                {auditStatus || auditStatus === 0 ? <span className={styles.wrapper_image_extra} style={{ backgroundColor: auditStatus === 0 ? '#1890FF' : auditStatus === 1 ? '#66CC66' : '#FF0000' }}>{auditStatus === 1 ? '审核通过' : auditStatus === 2 ? '审核未通过' : '审核中'}</span> : null}
            </li>
            <li className={styles.wrapper_content}>
                <p className={styles.wrapper_content_title}>{title}</p>
                {auditStatus === 2 ? <p className={styles.wrapper_content_warn} onClick={this.viewReason.bind(this, auditMsg)}>查看审核未通过原因>></p> : null}
                {(!auditStatus && auditStatus !== 0) || auditStatus === 1 ? <ul className={styles.wrapper_content_footer}>
                    <li><i className='iconfont icon-chakan' />{viewCount}</li>
                    <li><i className='iconfont icon-xiaoxi' />{commentCount}</li>
                    <li onClick={this.onLikes} className={isLike ? styles.active : null}><i className='iconfont icon-i-good' />{likeCount}</li>
                </ul> : null}
            </li>
        </ul>
    }
}