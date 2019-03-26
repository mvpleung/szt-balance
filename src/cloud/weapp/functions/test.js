const functions = require('./index')

const methods = ['deleteRecord', 'queryBalance', 'queryHistory', 'queryRecords']

methods.forEach(method =>
  console.log(
    functions.main(
      {
        call: method,
        env: '',
        data: {}
      },
      null
    )
  )
)
