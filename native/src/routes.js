export const routes = {
  home: () => "/",
  wiki: (type = ":type", id = ":id") => `/wiki/${type}/${id}`,
  map: () => "/map",
  photos: () => "/photos",
  photosCreate: () => "/photos/create",
  photosShow: (id = ":id") => `/photos/${id}`,
}
