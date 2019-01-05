import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TextareaItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import CustomModal from '../customModal';
import styles from './index.less';
const { alert } = CustomModal;

let container = null;
function unmount() {
    if (container) {
        ReactDOM.unmountComponentAtNode(container)
        document.body.removeChild(container)
        container = null;
    }
}
const typeIn = ({
    onSend = () => { },
    config = {}
}) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    let TypeIn = createForm()(class _typeIn extends Component {
        send = () => {
            this.props.form.validateFields((error, values) => {
                if (!error) {
                    alert({
                        message: '确认发送?',
                        actions: [
                            { text: '取消' },
                            {
                                text: '确认', onPress: () => {
                                    unmount();
                                    onSend(values.content);
                                }
                            }
                        ]
                    })
                } else
                    Toast.info('请输入内容', 0.7)
            })
        }
        componentWillUnmount() {
            CustomModal.unmountFnDialog();
        }
        render() {
            let { getFieldProps } = this.props.form;
            return (<div className={styles.mask} onClick={unmount}>
                <div className={styles.content} onClick={e => { e.stopPropagation() }}>
                    <TextareaItem
                        className={styles.content_input}
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
                    <div onClick={this.send} className={styles.content_operate}>发送</div>
                </div>
            </div>)
        }
    })
    ReactDOM.render(<TypeIn />, container)
}

typeIn.unmount = unmount;

export default typeIn;