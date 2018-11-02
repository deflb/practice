import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import routerBase from '../../router/routerBase';
import { Toast } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import styles from './index.less';

export default connect()(class casePdLook extends Component {
    static propTypes = {
        likeClick: PropTypes.func,
        rowData: PropTypes.object, // {imgUrl,title, des,views,comments,likes}
        updateCurrentItem: PropTypes.func, // 父组件更新
    }

    static defaultProps = {
        likeClick: function () { },
        rowData: {},
        updateCurrentItem: function () { }
    }

    onRowClick = () => { // 整行区域
        this.props.dispatch(push(routerBase + '/moreCase/case', this.props.rowData))
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
        const { rowData, style = null, className = null } = this.props;
        return <div className={`${styles.wrapper} ${className}`} style={style} onClick={this.onRowClick}>
            <img src={rowData.imgUrl} alt={rowData.imgUrl} />
            <div className={styles.wrapper_content}>
                <p className={styles.wrapper_content_title}>{rowData.title}</p>
                <p className={styles.wrapper_content_des}>{rowData.des}</p>
                <ul className={styles.wrapper_content_footer}>
                    <li><i className='iconfont icon-chakan' />{rowData.views}</li>
                    <li><i className='iconfont icon-xiaoxi' />{rowData.comments}</li>
                    <li onClick={this.onLikes}><i className='iconfont icon-i-good' />{rowData.likes}</li>
                </ul>
            </div>
        </div>
    }
})