const options = ['PC', 'Nintendo', 'PS4', 'PS5', 'XBOX']

function chosenOption(option) {
    let arr = []

    for(let el of options) {
        if(el === option) {
            const obj = {
                value: el,
                selected: true
            }
            arr.push(obj)
        } else {
            const obj = {
                value: el
            }
            arr.push(obj)
        }
    }

    return arr
}

module.exports = chosenOption