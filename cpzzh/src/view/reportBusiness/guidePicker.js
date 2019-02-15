import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TitleOperateModal from '../../component/titleOperateModal';
import CustomPicker from '../../component/customPicker/index';
import { request } from '../../request';
import api from '../../request/api';
import styles from './guidePicker.less';

export default class guidePicker extends Component {
    state = {
        visible: false,
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
    }
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
    }
    static defaultProps = {
        value: {},
        onChange: () => { },
        disabled: false,
    }
    getGuide = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true })
        request({ url: api.pageGuideReward, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                dataBlobs: _dataBlobs,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                loading: false,
            })
        }).catch(err => {
            this.setState({ loading: false });
        })
    }
    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getGuide()
    }
    componentDidMount() {
        this.selected = this.props.value;
        this.getGuide();
    }
    onClose = () => { this.setState({ visible: false }) }
    render() {
        const { visible, dataBlobs } = this.state, { children, value, onChange, disabled } = this.props;
        return (<div>
            {React.cloneElement(children, {
                onClick: () => { !disabled && this.setState({ visible: true }) }
            })}
            <TitleOperateModal
                title='选择导购员'
                visible={visible}
                onCancel={this.onClose}
                onOk={() => {
                    console.log(this.selected);
                    onChange(this.selected); this.onClose()
                }}
            >
                <div className={styles.guide}>
                    <p className={styles.guide_area}>以下为 “南城区” 所有导购员</p>
                    <CustomPicker
                        height={192}
                        itemHeight={64}
                        dataSource={dataBlobs}
                        renderItem={(rowData) => (<ul key={rowData.id} className={styles.guide_item}>
                            <li className={styles.guide_item_avatar}>{rowData.guideAvatar ? <img src={rowData.guideAvatar} alt={rowData.guideName} /> : null}</li>
                            <li className={styles.guide_item_content}>
                                <ul className={styles.top}><li className={styles.top_left}>{rowData.guideName}</li><li className={styles.top_right}>{rowData.reward}元</li></ul>
                                <ul className={styles.bottom}>
                                    <li>获取商机{rowData.gainCount}</li>
                                    <li>成交{rowData.dealCount}</li>
                                    <li>成交率{rowData.dealRate}</li>
                                </ul>
                            </li>
                        </ul>)}
                        onEndReached={this.onEndReached}
                        value={value}
                        onChange={guideInfo => { this.selected = guideInfo }}
                    />
                    <p className={styles.guide_tip}>导购员成交率越高，您获得提成的几率越大</p>
                </div>
            </TitleOperateModal>
        </div>)
    }
}