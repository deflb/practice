import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import styles from './index.less';

export default class titleOperateModal extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        onOk: PropTypes.func,
        okText: PropTypes.string,
        onCancel: PropTypes.func,
        cancelText: PropTypes.string
    }
    static defaultProps = {
        visible: false,
        title: '',
        onOk: () => { },
        okText: '确定',
        onCancel: () => { },
        cancelText: '取消'
    }
    render() {
        const { visible, onCancel, children, title, onOk, okText, cancelText } = this.props;
        return (<Modal
            popup
            visible={visible}
            onClose={onCancel}
            animationType="slide-up"
        >
            <div className={styles.wrapper}>
                <ul className={styles.top}>
                    <li onClick={onCancel}>{cancelText}</li>
                    <li>{title}</li>
                    <li onClick={onOk}>{okText}</li>
                </ul>
                {children}
            </div>
        </Modal>)
    }
}