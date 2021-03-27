using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moonglade.Data.Entities;

namespace Moonglade.Data.Configurations
{
    public class PageConfiguration : IEntityTypeConfiguration<PageEntity>
    {
        public void Configure(EntityTypeBuilder<PageEntity> builder)
        {
            builder.Property(e => e.Id).ValueGeneratedNever();
            builder.Property(e => e.Title).HasMaxLength(128);
            builder.Property(e => e.Slug).HasMaxLength(128);
            builder.Property(e => e.MetaDescription).HasMaxLength(256);
        }
    }
}
