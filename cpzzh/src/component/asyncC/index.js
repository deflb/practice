import React from 'react'

export default importFn => class asyncC extends React.Component {
    state = {
        C: null,
    }
    // componentWillMount() { // then链写法取值
    //     importFn().then(mod => { this.setState({ C: mod.default ? mod.default : null }) })
    // }
    async componentWillMount() { // 同步写法取值
        const { default: C } = await importFn()
        if (!this.isUnmount)
            this.setState({ C })
    }
    componentWillUnmount() {
        this.isUnmount = true
    }
    render() {
        const { C } = this.state;
        return C ? <C {...this.props} /> : <div>页面加载中...</div>
    }
}