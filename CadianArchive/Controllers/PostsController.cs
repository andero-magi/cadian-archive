namespace CadianArchive.Controllers;

using CadianArchive.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

[ApiController]
[Route("api/posts")]
public class PostsController : Controller
{
    /// <summary>
    /// Query Posts
    /// </summary>
    /// <param name="search">Post search</param>
    /// <returns></returns>
    [HttpGet]
    public async Task<List<Post>> GetPosts([FromQuery] string search)
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

    /// <summary>
    /// Get a post by its UUID
    /// </summary>
    /// <param name="id">Post ID</param>
    /// <returns></returns>
    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(Post), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetPost(Guid id)
    {
        return NotFound();
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    /// <param name="post">Post Data</param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType(typeof(Post), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreatePost(Post post)
    {
        return Created();
    }

    /// <summary>
    /// Update a post
    /// </summary>
    /// <param name="id">UUID of the post to update</param>
    /// <param name="post">New Post data</param>
    /// <returns></returns>
    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> UpdatePost(Guid id, Post post)
    {
        return Ok();
    }

    /// <summary>
    /// Deletes a post by it's UUID
    /// </summary>
    /// 
    /// <param name="id">UUID of the post to delete.</param>
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
