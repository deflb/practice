import React, { Component } from 'react';
import PropTypes from 'prop-types';
import typeIn from '../typeIn';
import styles from './bar.less';

export default class bar extends Component {
    static propTypes = {
        detail: PropTypes.object,
        onLike: PropTypes.func,
        onSend: PropTypes.func,
        onCollect: PropTypes.func,
        onComment: PropTypes.func,
    }
    static defaultProps = {
        detail: {}, // 数量: {views, collects, collected, likes, liked, comments} 查看 收藏 是否已收藏 点赞 是否已点赞 评价
        onLike: function () { },
        onSend: function () { },
        onCollect: function () { },
        onComment: function () { },
    }
    componentWillUnmount() {
        typeIn.unmount();
    }
    render() {
        const { detail, onLike, onSend, onCollect, onComment } = this.props,
            { views, collects, liked, likes, comments, collected } = detail;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_left} onClick={e => { typeIn({ onSend, config: { placeholder: "写评论" } }) }}>
                不写点什么吗？
            </div>
            <ul className={styles.wrapper_right}>
                {views || views === 0 ? <li><i className='iconfont icon-chakan' />{views}</li> : null}
                {collects || collects === 0 ? <li onClick={onCollect} className={collected ? styles.active : null}><i className='iconfont icon-collect' />{collects}</li> : null}
                {likes || likes === 0 ? <li onClick={onLike} className={liked ? styles.active : null}><i className='iconfont icon-i-good' />{likes}</li> : null}
                {comments || comments === 0 ? <li onClick={onComment}><i className='iconfont icon-xiaoxi' />{comments}</li> : null}
            </ul>
        </div>)
    }
}