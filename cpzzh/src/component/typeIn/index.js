import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextareaItem, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less';
const { alert } = Modal;

export default createForm()(class typeIn extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        onSend: PropTypes.func,
        config: PropTypes.object, // 支持传入 TextareaItem 可用参数
    }
    static defaultProps = {
        visible: false,
        onClose: function () { },
        onSend: function () { },
        config: {},
    }
    send = () => {
        const { form, onSend } = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                alert('提示', '确认发送?', [
                    { text: '取消' },
                    {
                        text: '确认', onPress: () => { onSend(values.content) }
                    }
                ])
            }
        })
    }
    render() {
        const { form, visible, onClose, config } = this.props,
            { getFieldProps } = form;
        return (visible ? <div className={styles.wrapper} onClick={e => { e.stopPropagation(); onClose() }}>
            <div className={styles.wrapper_box} onClick={e => { e.stopPropagation() }}>
                <TextareaItem
                    className={styles.wrapper_box_input}
                    autoFocus
                    {...getFieldProps('content', {
                        rules: [
                            { required: true },
                        ]
                    })}
                    rows={3}
                    count={100}
                    {...config}
                />
                <div onClick={this.send} className={styles.wrapper_box_operate}>发送</div>
            </div>
        </div> : null)
    }
})