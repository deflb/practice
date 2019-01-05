import React, { Component } from 'react';
import { List, Tabs } from 'antd-mobile';
import CustomWhiteSpace from '../../../../component/customWhiteSpace';
import fullScreen from '../../../../component/fullScreen';
import Get from './get';
import Use from './use';
import styles from './index.less';

export default fullScreen(class integralDetail extends Component {
    render() {
        let { location, history } = this.props,
            { state = {} } = location;
        return (
            <div className={styles.wrapper}>
                <List>
                    <List.Item
                        arrow="horizontal"
                        extra='进入积分商城'
                        multipleLine
                        onClick={() => { history.goBack() }}>
                        <span style={{ color: '#FF953C', marginRight: 8 }}>{state.score}</span>积分
                    </List.Item>
                </List>
                <CustomWhiteSpace />
                <Tabs
                    prerenderingSiblingsNumber={0}
                    swipeable={false}
                    tabs={[
                        { key: 'get', title: '获取' },
                        { key: 'use', title: '使用' },
                    ]}
                >
                    <Get key='get' />
                    <Use key='use' />
                </Tabs>
            </div>
        );
    }
})