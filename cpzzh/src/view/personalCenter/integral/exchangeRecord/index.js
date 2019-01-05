import React, { Component } from 'react';
import CustomListView from '../../../../component/customListView';
import fullScreen from '../../../../component/fullScreen';
import macBook_png from '../../../../assets/image/macBook.png';
import styles from './index.less';

export default fullScreen(class exchangeRecord extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
    }
    getExchangeRecord = () => {
        let mockData = [
            { id: 0, },
            { id: 1, },
            { id: 2, },
        ];
        this.setState({
            dataBlobs: mockData
        })
    }
    componentDidMount() {
        this.getExchangeRecord()
    }
    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        // this.getExchangeRecordList()
    }
    render() {
        let { dataBlobs, loading } = this.state;
        return (<CustomListView
            style={{ height: '100%' }}
            sectionBodyClassName={null}
            loading={loading}
            data={dataBlobs}
            onEndReached={this.onEndReached}
            renderRow={(rowData, sectionID, index) => (<div key={rowData.id} className={styles.item}>
                <span className={styles.item_img}>
                    <img src={macBook_png} alt='' />
                </span>
                <ul className={styles.item_content}>
                    <li>Apple MacBook</li>
                    <li className={styles.item_content_des}>轻巧，强劲</li>
                </ul>
                <span className={styles.item_flag}>
                    兑换成功
                </span>
            </div>)}
        />)
    }
})