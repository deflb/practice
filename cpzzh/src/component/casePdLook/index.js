import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class casePdLook extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        commentClick: PropTypes.func,
        likeClick: PropTypes.func,
        rowData: PropTypes.object, // {imgUrl,title, des,views,comments,likes}
    }

    static defaultProps = {
        onClick: function () { },
        commentClick: function () { },
        likeClick: function () { },
        rowData: {}
    }

    render() {
        const { onClick, likeClick, commentClick, rowData, style = null, className = null } = this.props;
        return <div className={`${styles.wrapper} ${className}`} style={style} onClick={onClick}>
            <img src={rowData.imgUrl} alt={rowData.imgUrl} />
            <div className={styles.wrapper_content}>
                <p className={styles.wrapper_content_title}>{rowData.title}</p>
                <p className={styles.wrapper_content_des}>{rowData.des}</p>
                <ul className={styles.wrapper_content_footer}>
                    <li><i className='iconfont icon-chakan' />{rowData.views}</li>
                    <li onClick={e => { e.stopPropagation(); commentClick() }}><i className='iconfont icon-xiaoxi' />{rowData.comments}</li>
                    <li onClick={e => { e.stopPropagation(); likeClick() }}><i className='iconfont icon-i-good' />{rowData.likes}</li>
                </ul>
            </div>
        </div>
    }
}