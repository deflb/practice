import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleOperateModal from '../titleOperateModal';
import PcdPickerView from './pcdPickerView';
import styles from './pcdPicker.less';

export default class pcdPicker extends Component {
    state = {
        visible: false,
    }
    static propTypes = {
        value: PropTypes.array,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
    }
    static defaultProps = {
        value: [],
        onChange: () => { },
        disabled: false,
    }
    componentDidMount() {
        this.selected = this.props.value;
    }
    onClose = () => { this.setState({ visible: false }) }
    render() {
        const { visible } = this.state, { children, value, onChange, disabled } = this.props;
        return (<div>
            {React.cloneElement(children, {
                onClick: () => { !disabled && this.setState({ visible: true }) }
            })}
            <TitleOperateModal
                title='选择区域'
                visible={visible}
                onCancel={this.onClose}
                onOk={() => {
                    onChange(this.selected); this.onClose()
                }}
            >
                <div>
                    <div className={styles.position}>
                        <span>当前定位：东莞市</span>
                        <span role='button' className={styles.position_btn}>选定</span>
                    </div>
                    <ul className={styles.pcd}>
                        <li>省</li>
                        <li>市</li>
                        <li>镇/区</li>
                    </ul>
                    <PcdPickerView
                        height={120}
                        itemHeight={40}
                        value={value}
                        onChange={(v) => { this.selected = v }}
                    />
                </div>
            </TitleOperateModal>
        </div>)
    }
}