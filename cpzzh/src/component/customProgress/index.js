import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

export default connect(state => ({
    userLevelInfo: state.userLevelInfo
}))(class customProgress extends Component {
    render() {
        const { userLevelInfo } = this.props,
            { userValue = 0 } = userLevelInfo,
            levelList = userLevelInfo.levelList || [],
            length = levelList.length,
            total = length ? levelList[length - 1].levelValue : userValue * 2,
            rate = userValue / total * 100 + '%';
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div style={{ width: rate }} className={styles.progress} />
                    <div className={styles.tip} style={{ left: rate }}>
                        当前成长值 {userValue}
                    </div>
                </div>
                <div className={styles.step}>
                    {levelList.map(item => {
                        const pos = item.levelValue / total;
                        return <ul key={item.levelValue} className={styles.step_item} style={{ left: pos * 100 + '%', transform: `translateX(${pos === 0 ? '-25%' : pos === 1 ? '-75%' : '-50%'})` }}>
                            <li className={styles.step_item_name}>{item.levelName}</li>
                            <li className={styles.step_item_value}>{item.levelValue}</li>
                        </ul>
                    })}
                </div>
            </div>
        )
    }
})