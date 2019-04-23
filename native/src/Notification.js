import { ToastAndroid } from "react-native"

/**
 *
 * @param {string} message
 * @param {"short" | "long"} length
 */
export function showNotification(message, length = "short") {
  const duration = {
    short: ToastAndroid.SHORT,
    long: ToastAndroid.LONG,
  }
  ToastAndroid.show(message, duration[length])
}
