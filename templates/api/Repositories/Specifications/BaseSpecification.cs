using System;
using System.Collections.Generic;
using System.Linq.Expressions;

public abstract class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>>? Criteria { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();

    protected void AddInclude(Expression<Func<T, object>> include)
    {
        Includes.Add(include);
    }
}
