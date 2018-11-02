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
        onSend: PropTypes.func
    }
    static defaultProps = {
        detail: {},
        onSend: function () { }
    }
    hide = () => {
        this.setState({ visible: false })
    }
    render() {
        const { visible } = this.state, { detail, onSend } = this.props,
            { views, collects, likes, comments } = detail;
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
                <li><i className='iconfont icon-chakan' />{views}</li>
                <li><i className='iconfont icon-collect' />{collects}</li>
                <li><i className='iconfont icon-i-good' />{likes}</li>
                <li><i className='iconfont icon-xiaoxi' />{comments}</li>
            </ul>
        </div>)
    }
}