export function time(num){
    let Num = num*1000
    let hour,min,second
    hour = new Date(Num).getHours()
    min = new Date(Num).getMinutes()
    second = new Date(Num).getSeconds()
    return `${min}:${second}`
}
