import exp from "express"
import { parse as parseUuid } from "uuid"

/**
 * Attempt to get the 'id' parameter and validate it. If 
 * validation fails, null is returned, and an erroneous code
 * sent as response, otherwise the ID is returned.
 * 
 * @param {exp.Request} req Request
 * @param {exp.Response} res Response
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
    parseUuid(id)
  } catch (err) {
    res.status(400).send({error: "Invalid UUID"})
    return null
  }
  
  return id
}