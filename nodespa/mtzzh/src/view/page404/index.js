import React from 'react';
import { Button } from 'antd-mobile';

export default ({ ...props }) => {
    const { history } = props;
    return <div>
        页面不存在！
        <Button onClick={e => { history.goBack() }}>返回</Button>
    </div>
}