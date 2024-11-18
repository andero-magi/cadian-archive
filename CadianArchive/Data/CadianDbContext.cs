namespace CadianArchive.Data;

using CadianArchive.Models;
using Microsoft.EntityFrameworkCore;

public class CadianDbContext: DbContext
{
    public DbSet<Post> Posts { get; set; }
}
