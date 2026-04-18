using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Models;

namespace TechSpace.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductSpecification> ProductSpecifications => Set<ProductSpecification>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Banner> Banners => Set<Banner>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Brand>(b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(100);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(120);
            b.HasIndex(x => x.Slug).IsUnique();
            b.Property(x => x.LogoUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<Category>(b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(100);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(120);
            b.HasIndex(x => x.Slug).IsUnique();
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.ImageUrl).HasMaxLength(500);
            b.HasOne(x => x.Parent)
             .WithMany(x => x.Children)
             .HasForeignKey(x => x.ParentId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(220);
            b.HasIndex(x => x.Slug).IsUnique();
            b.Property(x => x.Sku).IsRequired().HasMaxLength(60);
            b.HasIndex(x => x.Sku).IsUnique();
            b.Property(x => x.ShortDescription).HasMaxLength(500);
            b.Property(x => x.Description).HasMaxLength(4000);
            b.Property(x => x.MainImage).IsRequired().HasMaxLength(500);
            b.Property(x => x.Price).HasColumnType("decimal(18,2)");
            b.Property(x => x.OldPrice).HasColumnType("decimal(18,2)");

            b.HasOne(x => x.Category)
             .WithMany(x => x.Products)
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(x => x.Brand)
             .WithMany(x => x.Products)
             .HasForeignKey(x => x.BrandId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(x => new { x.IsActive, x.CategoryId });
            b.HasIndex(x => new { x.IsActive, x.BrandId });
            b.HasIndex(x => x.IsFeatured);
        });

        modelBuilder.Entity<ProductImage>(b =>
        {
            b.Property(x => x.Url).IsRequired().HasMaxLength(500);
            b.HasOne(x => x.Product)
             .WithMany(x => x.Images)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.ProductId, x.SortOrder });
        });

        modelBuilder.Entity<ProductSpecification>(b =>
        {
            b.Property(x => x.Group).IsRequired().HasMaxLength(100);
            b.Property(x => x.Key).IsRequired().HasMaxLength(200);
            b.Property(x => x.Value).IsRequired().HasMaxLength(500);
            b.HasOne(x => x.Product)
             .WithMany(x => x.Specifications)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.ProductId, x.SortOrder });
        });

        modelBuilder.Entity<Review>(b =>
        {
            b.Property(x => x.UserName).IsRequired().HasMaxLength(100);
            b.Property(x => x.Comment).IsRequired().HasMaxLength(1000);
            b.HasOne(x => x.Product)
             .WithMany(x => x.Reviews)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.ProductId, x.CreatedAt });
        });

        modelBuilder.Entity<Banner>(b =>
        {
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Subtitle).HasMaxLength(500);
            b.Property(x => x.ImageUrl).IsRequired().HasMaxLength(500);
            b.Property(x => x.LinkUrl).HasMaxLength(500);
            b.Property(x => x.CtaLabel).HasMaxLength(100);
            b.HasIndex(x => new { x.IsActive, x.SortOrder });
        });
    }
}
