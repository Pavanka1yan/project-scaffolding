using Microsoft.EntityFrameworkCore;
using System.Linq;

public static class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T>? spec)
    {
        var query = inputQuery;
        if (spec?.Criteria != null)
        {
            query = query.Where(spec.Criteria);
        }
        if (spec != null)
        {
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));
        }
        return query;
    }
}
