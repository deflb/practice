import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TypeIn from '../typeIn';
import styles from './bar.less';

export default class bar extends Component {
    state = {
        visible: false
    }
    static propTypes = {
        detail: PropTypes.object,
        onSend: PropTypes.func,
    }
    static defaultProps = {
        detail: {}, // 数量: {views, collects, likes, shares, comments} 查看 收藏 点赞 分享 评价
        onSend: function () { },
    }
    hide = () => {
        this.setState({ visible: false })
    }
    render() {
        const { visible } = this.state,
            { detail, onSend } = this.props,
            { views, collects, likes, shares, comments } = detail;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_left} onClick={e => { this.setState({ visible: true }) }}>
                不写点什么吗？
                <TypeIn
                    visible={visible}
                    onClose={() => { this.setState({ visible: false }) }}
                    onSend={onSend}
                    config={{
                        placeholder: "写评论"
                    }}
                />
            </div>
            <ul className={styles.wrapper_right}>
                {views || views === 0 ? <li><i className='iconfont icon-chakan' />{views}</li> : null}
                {collects || collects === 0 ? <li><i className='iconfont icon-collect' />{collects}</li> : null}
                {likes || likes === 0 ? <li><i className='iconfont icon-i-good' />{likes}</li> : null}
                {shares || shares === 0 ? <li><i className='iconfont icon-share' />{shares}</li> : null}
                {comments || comments === 0 ? <li><i className='iconfont icon-xiaoxi' />{comments}</li> : null}
            </ul>
        </div>)
    }
}