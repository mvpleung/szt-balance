let test = require('./index')

test
  .main(
    {
      cardNumber: '684477097'
    },
    null
  )
  .then(resp => console.dir(resp))
