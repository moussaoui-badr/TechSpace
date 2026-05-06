using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Models;

namespace TechSpace.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductMedia> ProductMedia => Set<ProductMedia>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductDocument> ProductDocuments => Set<ProductDocument>();
    public DbSet<ProductSpecification> ProductSpecifications => Set<ProductSpecification>();
    public DbSet<SpecAttribute> SpecAttributes => Set<SpecAttribute>();
    public DbSet<ProductAttributeValue> ProductAttributeValues => Set<ProductAttributeValue>();
    public DbSet<ProductTag> ProductTags => Set<ProductTag>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

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
            b.Property(x => x.Weight).HasColumnType("decimal(10,2)");
            b.Property(x => x.ProductLength).HasColumnType("decimal(10,2)");
            b.Property(x => x.ProductWidth).HasColumnType("decimal(10,2)");
            b.Property(x => x.ProductHeight).HasColumnType("decimal(10,2)");
            b.Property(x => x.MetaTitle).HasMaxLength(200);
            b.Property(x => x.MetaDescription).HasMaxLength(500);
            b.Property(x => x.Barcode).HasMaxLength(30);
            b.Property(x => x.VendorUrl).HasMaxLength(500);
            b.Property(x => x.SourceUrl).HasMaxLength(500);
            b.HasIndex(x => x.ExternalId).IsUnique().HasFilter("[ExternalId] IS NOT NULL");

            b.HasOne(x => x.Category)
             .WithMany(x => x.Products)
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(x => x.Brand)
             .WithMany(x => x.Products)
             .HasForeignKey(x => x.BrandId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasMany(x => x.Tags)
             .WithMany(x => x.Products)
             .UsingEntity("ProductTagLinks");

            b.HasIndex(x => new { x.IsActive, x.CategoryId });
            b.HasIndex(x => new { x.IsActive, x.BrandId });
            b.HasIndex(x => x.IsFeatured);
        });

        modelBuilder.Entity<ProductMedia>(b =>
        {
            b.Property(x => x.Url).IsRequired().HasMaxLength(500);
            b.Property(x => x.PosterUrl).HasMaxLength(500);
            b.Property(x => x.Alt).HasMaxLength(300);
            b.HasOne(x => x.Product)
             .WithMany(x => x.Media)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.ProductId, x.SortOrder });
        });

        modelBuilder.Entity<ProductVariant>(b =>
        {
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Sku).IsRequired().HasMaxLength(60);
            b.HasIndex(x => x.Sku).IsUnique();
            b.Property(x => x.Barcode).HasMaxLength(30);
            b.Property(x => x.OptionsJson).HasMaxLength(1000);
            b.Property(x => x.Price).HasColumnType("decimal(18,2)");
            b.Property(x => x.OldPrice).HasColumnType("decimal(18,2)");
            b.HasOne(x => x.Product)
             .WithMany(x => x.Variants)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.ProductId, x.SortOrder });
        });

        modelBuilder.Entity<ProductDocument>(b =>
        {
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Url).IsRequired().HasMaxLength(500);
            b.Property(x => x.Language).HasMaxLength(2);
            b.HasOne(x => x.Product)
             .WithMany(x => x.Documents)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => x.ProductId);
        });

        modelBuilder.Entity<SpecAttribute>(b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(100);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(100);
            b.HasIndex(x => x.Slug).IsUnique();
            b.Property(x => x.Unit).HasMaxLength(20);
            b.HasOne(x => x.CategoryScopeNav)
             .WithMany()
             .HasForeignKey(x => x.CategoryScope)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProductAttributeValue>(b =>
        {
            b.Property(x => x.TextValue).HasMaxLength(500);
            b.Property(x => x.NumericValue).HasColumnType("decimal(18,4)");
            b.HasOne(x => x.Product)
             .WithMany(x => x.AttributeValues)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasOne(x => x.Attribute)
             .WithMany(x => x.ProductValues)
             .HasForeignKey(x => x.AttributeId)
             .OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(x => new { x.ProductId, x.AttributeId }).IsUnique();
        });

        modelBuilder.Entity<ProductTag>(b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(100);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(120);
            b.HasIndex(x => x.Slug).IsUnique();
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
            b.Property(x => x.VideoUrl).HasMaxLength(500);
            b.Property(x => x.PosterUrl).HasMaxLength(500);
            b.Property(x => x.MobileImageUrl).HasMaxLength(500);
            b.Property(x => x.LinkUrl).HasMaxLength(500);
            b.Property(x => x.CtaLabel).HasMaxLength(100);
            b.HasIndex(x => new { x.IsActive, x.SortOrder });
        });

        modelBuilder.Entity<AppUser>(b =>
        {
            b.Property(x => x.FirstName).IsRequired().HasMaxLength(100);
            b.Property(x => x.LastName).IsRequired().HasMaxLength(100);
            b.Property(x => x.Phone).HasMaxLength(20);
        });

        modelBuilder.Entity<Order>(b =>
        {
            b.Property(x => x.OrderNumber).IsRequired().HasMaxLength(20);
            b.HasIndex(x => x.OrderNumber).IsUnique();
            b.Property(x => x.ShipFullName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ShipPhone).IsRequired().HasMaxLength(20);
            b.Property(x => x.ShipAddress).IsRequired().HasMaxLength(300);
            b.Property(x => x.ShipCity).IsRequired().HasMaxLength(100);
            b.Property(x => x.ShipPostalCode).HasMaxLength(10);
            b.Property(x => x.ShipCountry).IsRequired().HasMaxLength(100);
            b.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");
            b.Property(x => x.Shipping).HasColumnType("decimal(18,2)");
            b.Property(x => x.Total).HasColumnType("decimal(18,2)");
            b.HasOne(x => x.User)
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(x => new { x.UserId, x.CreatedAt });
        });

        modelBuilder.Entity<OrderItem>(b =>
        {
            b.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            b.Property(x => x.ProductImage).HasMaxLength(500);
            b.Property(x => x.ProductSku).HasMaxLength(60);
            b.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            b.Property(x => x.Total).HasColumnType("decimal(18,2)");
            b.HasOne(x => x.Order)
             .WithMany(x => x.Items)
             .HasForeignKey(x => x.OrderId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Address>(b =>
        {
            b.Property(x => x.Label).IsRequired().HasMaxLength(32);
            b.Property(x => x.FullName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Phone).IsRequired().HasMaxLength(20);
            b.Property(x => x.Line1).IsRequired().HasMaxLength(300);
            b.Property(x => x.Line2).HasMaxLength(300);
            b.Property(x => x.City).IsRequired().HasMaxLength(100);
            b.Property(x => x.PostalCode).IsRequired().HasMaxLength(10);
            b.Property(x => x.Country).IsRequired().HasMaxLength(100);
            b.HasOne(x => x.User)
             .WithMany(x => x.Addresses)
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => x.UserId);
        });
    }
}
