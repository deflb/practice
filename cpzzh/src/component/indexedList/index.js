import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ListView } from 'antd-mobile';
import styles from './index.less';

export default class indexedList extends Component {
    state = {
        height: 0,
        dataSource: new ListView.DataSource({
            getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
            getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        })
    }
    static propTypes = {
        formatData: PropTypes.func,
        renderRow: PropTypes.func,
        renderFooter: PropTypes.func,
    }
    static defaultProps = {
        formatData: function () { },
        renderRow: function () { },
        renderFooter: function () { },
    }
    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
    }

    render() {
        const { height, dataSource } = this.state,
            { renderRow, formatData, renderFooter } = this.props;
        return (<ListView.IndexedList
            ref={instance => this.lv = instance}
            style={{ height }}
            dataSource={formatData(dataSource)}
            renderSectionHeader={sectionData => <div className={styles.wrapper_section_header}>{sectionData}</div>}
            renderRow={renderRow}
            renderFooter={renderFooter}
            renderBodyComponent={() => <div className={styles.wrapper}></div>}
            renderSectionWrapper={(sectionID) => <div key={sectionID} className={styles.wrapper_section} />}
            delayTime={10}
        />)
    }
}