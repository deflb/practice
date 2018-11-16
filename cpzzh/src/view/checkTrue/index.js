import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { InputItem, Icon } from 'antd-mobile';
// import wx from 'weixin-js-sdk';
import styles from './index.less';

export default createForm()(class checkTrue extends Component {

    componentDidMount() { // 挂载时 进行wx.config 配置
        const { href } = window.location,
            url = href.replace(/#.*/, '');
        console.log(url)
    }

    goToScan = () => { // wx.

    }

    search = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                console.log(values)
            }
        })
    }

    render() {
        const { getFieldProps } = this.props.form;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_box}>
                <InputItem
                    {...getFieldProps('number', {
                        rules: [
                            { required: true },
                        ]
                    })}
                    clear
                    className={styles.wrapper_box_input}
                    placeholder='请输入条码编号'
                />
                <ul className={styles.wrapper_box_operate}>
                    <li onClick={this.goToScan}>
                        <Icon type='cross' />
                    </li>
                    <li onClick={this.search}>
                        <Icon type='search' />
                    </li>
                </ul>
            </div>
        </div>)
    }
})