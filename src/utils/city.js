const getCityForCode = function (code, areaDatas) {
  const city = []
  areaDatas.map(v => {
    if (v.Code === code[0].toString()) {
      city[0] = v.Name
      if (v.Children) {
        v.Children.map(it => {
          if (it.Code === code[1].toString()) {
            city[1] = it.Name
            it.Children.map(item => {
              if (item.Code === code[2].toString()) {
                city[2] = item.Name
              }
            })
          }
        })
      }
    }
  })
  return city
}

const getCodeForCity = function (code, acode, areaDatas) {
  const city = []
  areaDatas.map(v => {
    if (v.Name === code[0].toString()) {
      city[0] = v.Code
      if (v.Children) {
        v.Children.map(it => {
          if (it.Name === code[1].toString()) {
            city[1] = it.Code
            it.Children.map(item => {
              if (item.Name === code[2].toString() && item.Code === acode.toString()) {
                city[2] = item.Code
              }
            })
          }
        })
      }
    }
  })
  if (city[2]) {
    return city
  } else if (city.length == 1) {
    return city
  } else {
    return []
  }

}

export {
  getCityForCode,
  getCodeForCity
}
