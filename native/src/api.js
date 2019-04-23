// // import fetch from "node-fetch"

const API_URL = __DEV__ ? "http://192.168.142.190:3000" : "https://seedling-api.herokuapp.com"

function apiRequest(path, data = {}, asFormData = false) {
  let body
  if (asFormData) {
    body = new FormData()
    for (const key in data) {
      body.append(key, data[key])
    }
  } else {
    body = JSON.stringify(data)
  }

  return fetch(join(API_URL, path), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": asFormData ? "multipart/form-data" : "application/json",
    },
    body,
  })
    .then(response => response.json())
    .then(response => {
      if ("error" in response) {
        throw response.error
      } else {
        return response.data
      }
    })
}

function join(...parts) {
  if (parts.length === 0) {
    return ""
  }
  const url = parts.reduce((acc, part) => {
    if (part.startsWith("/") && acc.endsWith("/")) {
      return `${acc.slice(0, -1)}${part}`
    } else if (part.startsWith("/") || acc.endsWith("/")) {
      return `${acc}${part}`
    } else {
      return `${acc}/${part}`
    }
  })
  return url
}

// export const api = {

// }
export const api = {
  photoCreate: data => apiRequest(`photoCreate`, data, true),
  wikiSearch: query => apiRequest("wikiSearch", { query }),
  wikiShowPlant: id => apiRequest(`wikiShowPlant`, { id }),
  wikiShowDisease: id => apiRequest(`wikiShowDisease`, { id }),

  plantList: () => apiRequest("plantList"),

  mapMarkers: () => apiRequest("mapMarkers"),

  photoDestroy: id => apiRequest(`photoDestroy`, { id }),
  photoShow: id => apiRequest(`photoShow`, { id }),
  photoUrl: id => join(API_URL, "photo", id),
}
