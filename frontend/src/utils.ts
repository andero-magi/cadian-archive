import { API_URL } from "./consts";

export async function getPost(id: string): Promise<any> {
  let fetchUrl = `${API_URL}/posts/${id}`
  let response = await fetch(fetchUrl)

  if (!response.ok) {
    return null
  }
  
  let json = await response.json()

  json.modified_date = new Date(json.modified_date)
  json.upload_date = new Date(json.upload_date)

  return json
}