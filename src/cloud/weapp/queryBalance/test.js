let queryBalance = require('./index')

queryBalance
  .main(
    {
      cardNumber: '684477097'
    },
    null
  )
  .then(resp => console.dir(resp))
