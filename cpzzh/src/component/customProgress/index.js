import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

export default connect(state => ({
    userLevelInfo: state.userLevelInfo
}))(class customProgress extends Component {
    render() {
        const { userLevelInfo } = this.props,
            { userValue = 0, levelList = [] } = userLevelInfo,
            length = levelList.length,
            total = length ? levelList[length - 1].levelValue : 0,
            rate = userValue / total * 100 + '%';
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div style={{ width: rate }} className={styles.progress}></div>
                    <div className={styles.tip} style={{ left: rate }}>
                        <div className='textFontSizeC'><span className='shallowGreyColor'>当前成长值：</span><span className='redColor'>{userValue}</span></div>
                        <i />
                    </div>
                </div>
                <div className={styles.step}>
                    {levelList.map(item => {
                        const pos = item.levelValue / total;
                        return <div key={item.levelValue} style={{ left: pos * 100 + '%', transform: `translateX(${pos === 0 ? '-25%' : pos === 1 ? '-75%' : '-50%'})` }}>
                            <div><span className='shallowGreyColor textFontSizeC'>{item.levelName}</span></div>
                            <div><span className='redColor textFontSizeC'>{item.levelValue}</span></div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
})