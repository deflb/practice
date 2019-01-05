import React, { Component } from 'react';
import Title from '../title';
import CustomWhiteSpace from '../../../../component/customWhiteSpace';
import CustomCarousel from '../../../../component/customCarousel';
import fullScreen from '../../../../component/fullScreen';
import EnabledIosScrollView from '../../../../component/enabledIosScrollView';
import score_png from '../../../../assets/image/score.png';
import macBook_png from '../../../../assets/image/macBook.png';
import styles from './index.less';

export default fullScreen(class productDetail extends Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <CustomCarousel
                    source={[macBook_png]}
                />
                <ul className={styles.wrapper_operate}>
                    <li className={styles.wrapper_operate_left}>3000<img src={score_png} alt='' /></li>
                    <li className={styles.wrapper_operate_right}>立即兑换</li>
                </ul>
                <CustomWhiteSpace />
                <EnabledIosScrollView>
                    <div className={styles.wrapper_content}>
                        <Title title='商品名称' />
                        <p>商品名称商品名称商品名称商品名称商品名称商品名称商品名称</p>
                        <Title title='抽奖流程' />
                        <p>抽奖流程抽奖流程抽奖流程抽奖流程抽奖流程抽奖流程抽奖流程抽奖流程</p>
                        <Title title='温馨提示' />
                        <p>温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示</p>
                    </div>
                </EnabledIosScrollView>
            </div>
        );
    }
})