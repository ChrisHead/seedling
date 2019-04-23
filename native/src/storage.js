import AsyncStorage from "@react-native-community/async-storage"

export const PHOTO_STORAGE_KEY = "@Seedling/photoIds"

export async function loadPhotoIds() {
  const idString = await AsyncStorage.getItem(PHOTO_STORAGE_KEY)
  return idString ? idString.split(",") : []
}
export async function savePhotoIds(ids) {
  await AsyncStorage.setItem(PHOTO_STORAGE_KEY, ids.join(","))
}
export async function appendPhotoId(id) {
  const photoIds = await loadPhotoIds()
  photoIds.push(id)
  await savePhotoIds(photoIds)
}
export async function removePhotoId(id) {
  let photoIds = await loadPhotoIds()
  photoIds = photoIds.filter(pid => pid !== id)
  await savePhotoIds(photoIds)
}
