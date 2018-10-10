class lr {
    constructor(props) {
        const { data } = props;
        this.data = [...data];
        this.init()
    }
    init() {
        this.format();
    }
    createLinearRegFn() {
        let x_avg = this.formatData.reduce((res, now) => res += now.index, 0) / this.formatData.length,
            y_avg = this.formatData.reduce((res, now) => res += now.val, 0) / this.formatData.length;
        const lv = () => { // 斜率
            return this.formatData.reduce((res, now) => {
                return res += (now.index - x_avg) * (now.val - y_avg)
            }, 0) / this.formatData.reduce((res, now) => {
                return res += (now.index - x_avg) * (now.index - x_avg)
            }, 0)
        }
        let a = lv(), b = this.data[0] - a * 0;

        this.linearRegFn = function (x) {
            return a * x + b;
        }
    }
    format() {
        this.formatData = [...this.data.map((item, index) => ({
            val: item,
            index: index,
        }))]
        this.createLinearRegFn();
    }
    forecast(index) {
        let res = [...this.data], length = this.data.length;
        if (index > length)
            for (let i = length; i <= index; i++) {
                res = [
                    ...res,
                    this.linearRegFn(i)
                ]
            }
        return res;
    }
}

const instance = new lr({
    data: [2, 5]
})
let res = instance.forecast(10)