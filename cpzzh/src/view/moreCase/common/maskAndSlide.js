import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './maskAndSlide.less';

export default class customModal extends Component {

    static propTypes = {
        onCancel: PropTypes.func, // 关闭模态框
        visible: PropTypes.bool, // 是否显示
        maskClose: PropTypes.bool, // 点击背景关闭模态框
    }

    static defaultProps = {
        onCancel: () => { },
        visible: false,
        maskClose: true
    }

    componentDidMount() {
        this.modal = document.createElement('div');
        document.body.appendChild(this.modal);
        this.renderModal()
    }
    componentWillReceiveProps(nextProps) {
        const { visible, children } = nextProps;
        this.renderModal(visible, children);
    }
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.modal)
        document.body.removeChild(this.modal)
    }
    renderModal = (visible = this.props.visible, children = this.props.children) => {
        const { onCancel, maskClose } = this.props;
        ReactDOM.render(
            <div>
                <div
                    className={styles.mask}
                    onClick={e => { if (maskClose) onCancel() }}
                    style={{ display: visible ? null : 'none' }}
                />
                <div
                    className={styles.dialog_content}
                    ref={distance => this.dialog = distance}
                >{children}</div>
            </div>,
            this.modal,
            () => {
                let timer = null,
                    ele = this.dialog;
                if (!ele) return
                if (visible) {
                    ele.style.display = 'block';
                    timer = setTimeout(() => {
                        ele.style.transform = "translateX(0)";
                        clearTimeout(timer)
                        timer = null;
                    }, 0)
                } else {
                    ele.style.transform = "translateX(100%)";
                    timer = setTimeout(() => {
                        ele.style.display = "none";
                        clearTimeout(timer)
                        timer = null;
                    }, 200)
                }
            }
        )
    }
    render() {
        return null
    }
}