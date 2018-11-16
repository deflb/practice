import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaskAndSlide from './maskAndSlide';
import styles from './filter.less';

export default class filter extends Component {
    state = {
        visible: false,
    }
    static propTypes = {
        onRest: PropTypes.func, // 重置
        onOk: PropTypes.func, // 确定
    }

    static defaultProps = {
        onRest: () => { },
        onOk: () => { },
    }
    onCancel = () => { this.setState({ visible: false }) }
    render() {
        const { visible } = this.state, { children, onRest, onOk } = this.props;
        return (
            <span onClick={e => { this.setState({ visible: true }) }}>
                <i className='iconfont icon-filter' style={{ fontSize: 22 }} />
                <MaskAndSlide
                    visible={visible}
                    onCancel={this.onCancel}
                >
                    <div className={styles.wrapper}>
                        <div>
                            {children}
                        </div>
                        <div className='xBoth1px'>
                            <span onClick={onRest}>重置</span>
                            <span onClick={() => {
                                onOk()
                                this.onCancel()
                            }}>确定</span>
                        </div>
                    </div>
                </MaskAndSlide>
            </span>
        );
    }
}