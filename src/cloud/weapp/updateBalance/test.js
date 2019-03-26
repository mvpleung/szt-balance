let test = require('./index')

test
  .main(
    {
      env: 'szt-balance-ac8d11'
    },
    null
  )
  .then(resp => console.dir(resp))
