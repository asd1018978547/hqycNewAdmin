export default (list) => {
  var twodDscartes = function(a, b) {
    var ret = []
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        ret.push(ft(a[i], b[j]))
      }
    }
    return ret
  }
  var ft = function(a, b) {
    if (!(a instanceof Array)) {
      a = [a]
    }
    var ret = a.slice(0)
    ret.push(b)
    return ret
  }
  return (function(data) {
    var len = data.length
    if (len === 0) {
      return []
    } else if (len === 1) {
      return data[0]
    } else {
      var r = data[0]
      for (var i = 1; i < len; i++) {
        r = twodDscartes(r, data[i])
      }
      return r
    }
  })(list)
}
