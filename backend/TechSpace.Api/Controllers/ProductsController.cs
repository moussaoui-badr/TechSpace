using Microsoft.AspNetCore.Mvc;
using TechSpace.Api.DTOs;
using TechSpace.Api.Services;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(ProductService products) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductSummaryDto>>> Search(
        [FromQuery] ProductQuery query,
        CancellationToken ct)
    {
        var result = await products.SearchAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDetailDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var product = await products.GetBySlugAsync(slug, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet("{id:int}/reviews")]
    public async Task<ActionResult<IReadOnlyList<ReviewDto>>> GetReviews(int id, CancellationToken ct)
    {
        var reviews = await products.GetReviewsAsync(id, ct);
        return Ok(reviews);
    }
}
