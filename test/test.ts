
const npz_loader = require("../src")
const getval = async function (){
    console.time("load")
    const a = await npz_loader.load('test/mat.npz')
    console.timeEnd("load")
    return a
}
let a = getval().then(a => console.log(a))
console.log("done")

