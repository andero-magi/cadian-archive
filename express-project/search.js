import { Post } from "./models/Post.model.js";
import TagService from "./tag-service.js";
import { FieldSearch, TagSearch } from "./tags-parser.js";

export class PostAndTag {
  /**
   * @param {Post} post 
   * @param {string[]} tags 
   */
  constructor(post, tags) {
    this.post = post
    this.tags = tags
  }
}

/**
 * @param {TagService} tags 
 * @param {Post[]} posts
 * @param {(TagSearch | FieldSearch)[]} searchArr 
 * @returns {Promise<PostAndTag[]>}
 */
export async function filterPosts(tags, posts, searchArr) {
  let result = []

  outer: for (let post of posts) {
    let tagObjects = await tags.getLinkedTags(post)
    let postTags = tagObjects.map(t => t.id)

    for (let f of searchArr) {
      if (testPost(post, postTags, f)) {
        continue
      }

      continue outer
    }

    result.push(new PostAndTag(post, postTags))
  }

  let sortTag = findFieldSearch(searchArr, "sort")
  if (sortTag != null) {
    applySort(result, sortTag.fieldValue, sortTag.negated)
  }

  return result
}

/**
 * @param {PostAndTag[]} posts 
 * @param {string} sortName 
 * @param {boolean} sortNegated 
 */
function applySort(posts, sortName, sortNegated) {
  switch (sortName.toLowerCase()) {
    case "edited":
    case "modified":
      // sort by modified_date field
      applySortByDate(posts, p => p.modified_date, sortNegated)

    case "created":
    case "uploaded":
      // sort by upload_date field
      applySortByDate(posts, p => p.upload_date, sortNegated)
  }
}

/**
 * @param {PostAndTag[]} posts 
 * @param {(post: Post) => string} dateAccess 
 * @param {boolean} negated 
 */
function applySortByDate(posts, dateAccess, negated) {
  posts.sort((a, b) => {
    let d1 = new Date(dateAccess(a.post))
    let d2 = new Date(dateAccess(b.post))

    if (negated) {
      let t = d1
      d1 = d2
      d2 = t
    }

    return d1.getTime() - d2.getTime()
  })
}

/**
 * @param {(FieldSearch|TagSearch)} tags 
 * @param {string} fieldName 
 * @returns {FieldSearch}
 */
function findFieldSearch(tags, fieldName) {
  for (let f of tags) {
    if (!(f instanceof FieldSearch)) {
      continue
    }

    if (f.fieldName != fieldName) {
      continue
    }

    return f
  }

  return undefined
}

/**
 * @param {Post} post 
 * @param {string[]} tags
 * @param {TagSearch | FieldSearch} filter 
 */
function testPost(post, tags, filter) {
  if (filter instanceof TagSearch) {
    let hasTag = tags.includes(filter.tagName)
    return hasTag != filter.negated
  }


  let authorSearch = findFieldSearch(tags, "uploader")
  if (authorSearch == null) {
    return true
  }

  return authorSearch.fieldValue == post.author_id
}