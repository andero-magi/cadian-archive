import { Response, Request } from "express"
import UUID from "uuid"

/**
 * Attempt to get the 'id' parameter and validate it. If 
 * validation fails, null is returned, and an erroneous code
 * sent as response, otherwise the ID is returned.
 * 
 * @param {Request} req Request
 * @param {Response} res Response
 * 
 * @returns The validated ID, or null
 */
export function getIdParam(req, res) {
  let id = req.params.id

  if (id == null) {
    res.status(400).send({error: "No ID"})
    return null
  }
  
  try {
    UUID.parse(id)
  } catch (err) {
    res.status(400).send({error: "Invalid UUID"})
    return null
  }
  
  return id
}