import React, { Component } from 'react';
import styles from './index.less';

export default class customProgress extends Component {
    render() {
        const { current = 0, total = 100, step = [] } = this.props,
            rate = current / total * 100 + '%';
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div style={{ width: rate }} className={styles.progress}></div>
                    <div className={styles.tip} style={{ left: rate }}>
                        <div className='textFontSizeC'><span className='shallowGreyColor'>当前成长值：</span><span className='redColor'>{current}</span></div>
                        <i />
                    </div>
                </div>
                <div className={styles.step}>
                    {step.map(item => {
                        const pos = item.val / total;
                        return <div key={item.val} style={{ left: pos * 100 + '%', transform: `translateX(${pos === 0 ? '-25%' : pos === 1 ? '-75%' : '-50%'})` }}>
                            <div>{item.title}</div>
                            <div>{item.extra}</div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}