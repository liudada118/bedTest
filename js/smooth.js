export function smooth(arr) {
    let res = [...arr]
    for (let i = 0; i < arr.length-1; i++) {
        for (let j = 0; j < 3; j++) {
            let a = parseInt(arr[i] + ((arr[i+1] - arr[i])*(j+1)/4))
            res.splice(i*4+j+1,0,a)
        }
    }
    return res
}

// console.log(smooth([10,20,30,40]),'111')