export function ab2str(buf) {
  return new Uint8Array(buf).reduce((acc, x) => acc + String.fromCharCode(x), "")
}
export function str2ab(str) {
  var buf = new ArrayBuffer(str.length) // 2 bytes for each char
  var bufView = new Uint8Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

export const flatten = <T>(arr: T[][]): T[] => Array.prototype.concat.call([], ...arr)
