namespace CadianArchive.Controllers;

using CadianArchive.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

[ApiController]
[Route("api/posts")]
public class PostsController : Controller
{
    [HttpGet]
    public async Task<List<Post>> GetPosts()
    {
        return [
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()},
            new() {Id = Guid.NewGuid()}
        ];
    }


    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(Post), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetPost(Guid id)
    {
        return NotFound();
    }

    [HttpPost]
    [ProducesResponseType(typeof(Post), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreatePost(Post post)
    {
        return Created();
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdatePost(Guid id, Post post)
    {
        return Ok();
    }

    /// <summary>
    /// Deletes a post by it's ID
    /// </summary>
    [Description("Deletes a post by it's ID")]
    [HttpDelete]
    [Route("{id}")]
    [ProducesResponseType(404)]
    [ProducesResponseType(202)]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        return NotFound();
    }
}
