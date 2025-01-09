export type ContentType = 'title' | 'header' | 'section' | 'imagedata' | 'imageref'

export interface Content {
  type: ContentType
  data: string
}

export interface Post {
  id?: string
  content?: Content[]
  tags?: string[],
  upload_date?: string
  modified_date?: string
}