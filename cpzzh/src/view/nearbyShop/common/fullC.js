import React, { Component } from 'react';
import fullScreen from '../../../component/fullScreen';
import EnabledIosScrollView from '../../../component/enabledIosScrollView';
import { getDisplayName } from '../../../utlis';
import styles from './fullC.less';

export default flag => WrappedComponent => fullScreen(class extends Component {

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    goToAppointment = () => {
        const { match, history, location, userInfo } = this.props,
            { state = {} } = location;
        history.push({
            pathname: match.path + '/measureRoom',
            state: { ...state, flag, customerId: userInfo.customerId, userName: userInfo.name, isAuth: userInfo.isAuth }
        })
    }

    render() {
        return <div className={styles.wrapper}>
            <EnabledIosScrollView>
                <WrappedComponent {...this.props} />
            </EnabledIosScrollView>
            <div className={styles.wrapper_btn} onClick={this.goToAppointment}>预约量房</div>
        </div>
    }
})