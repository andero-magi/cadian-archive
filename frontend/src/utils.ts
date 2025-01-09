import { API_URL } from "./consts";
import { Post } from "./post";

export async function getPost(id: string): Promise<Post> {
  let fetchUrl = `${API_URL}/posts/${id}`
  let response = await fetch(fetchUrl)

  if (!response.ok) {
    return null
  }
  
  let json = await response.json()
  return json
}