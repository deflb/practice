import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomProgress from '../../../component/customProgress';
import portrait_png from '../../../assets/image/portrait.png';
import list_thumb_png from '../../../assets/image/list_thumb.png';
import styles from './index.less';

export default class grade extends Component {
    render() {
        return (
            <div>
                <div className={styles.grade_wrapper}>
                    <i className={`iconfont icon-question ${styles.grade_wrapper_question}`} />
                    <div className={styles.grade_wrapper_avator}><img src={portrait_png} alt='' /></div>
                    <p className='highFontSizeC'>陈莉莉</p>
                    <span className={`textFontSizeC ${styles.grade_wrapper_tip}`}>银牌会员</span>
                    <CustomProgress
                        current={8000}
                        total={28000}
                        step={[
                            { val: 0, title: <span className='shallowGreyColor textFontSizeC'>普通会员</span>, extra: <span className='redColor textFontSizeC'>0</span> },
                            { val: 14000, title: <span className='shallowGreyColor textFontSizeC'>银牌会员</span>, extra: <span className='redColor textFontSizeC'>14000</span> },
                            { val: 28000, title: <span className='shallowGreyColor textFontSizeC'>金牌会员</span>, extra: <span className='redColor textFontSizeC'>28000</span> },
                        ]}
                    />
                </div>
                <CustomWhiteSpace />
                <Card full>
                    <Card.Header title={<span className='titleFontSizeC'>会员尊享权益</span>} />
                    <Card.Body className={styles.card_body}>
                        {[
                            { title: '下单获积分', extra: '' },
                            { title: '每月送积分', extra: '' },
                            { title: '积分兑换', extra: '' },
                            { title: '专属客服', extra: '金牌会员专享' },
                        ].map(item => <div key={item.title}>
                            <img src={list_thumb_png} alt={item.title} />
                            <p className='normalFontSizeC'>{item.title}</p>
                            <p className='textFontSizeC redColor'>{item.extra}</p>
                        </div>)}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}