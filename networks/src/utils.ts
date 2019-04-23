/*
 Postgres does not allow the character \u0000 inside of text.
 To circumvent this we simply add 1 to any value before encoding it with ab2str
 Then with str2ab we simply subtract 1 after conversion
 */

export function ab2str(buf) {
  return new Uint8Array(buf).reduce((acc, x) => acc + String.fromCharCode(x + 1), "")
}
export function str2ab(str: string) {
  var buf = new ArrayBuffer(str.length) // 2 bytes for each char
  var bufView = new Uint8Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i) - 1
  }
  return buf
}

export const flatten = <T>(arr: T[][]): T[] => Array.prototype.concat.call([], ...arr)
