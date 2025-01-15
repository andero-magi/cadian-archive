import { API_URL } from "./consts";
import { Post } from "./post";
import { FieldSearch, TagSearch } from "./utilities/tags-parser";

export async function getPost(id: string): Promise<Post> {
  let fetchUrl = `${API_URL}/posts/${id}`
  let response = await fetch(fetchUrl)

  if (!response.ok) {
    return null
  }
  
  let json = await response.json()
  return json
}

export function searchTermsToString(terms: (FieldSearch | TagSearch)[]): string {
  if (terms == null || terms.length < 1) {
    return ""
  }

  let newStr = ""
  for (let tag of terms) {
    if (tag.negated) {
      newStr += "-"
    }
    newStr += tag.toString() + " "
  }
  
  return newStr.trim()
}