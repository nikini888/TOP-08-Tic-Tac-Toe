function promiseFn(fn, time) {
    return new Promise(res => {
        setTimeout(() => {
            fn()
            res()
        }, time)
    })
}
async function setTimeoutFunction(fn, time) {
    await promiseFn(fn, time)
}
export default setTimeoutFunction