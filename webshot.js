const webshot = require('webshot')

const url = process.argv[2]
const path = process.argv[3]

webshot(url, path, (error) => {
    if (error) {
        console.error(error)
        process.exit(1)
    }

    process.exit(0)
})
