﻿namespace Moonglade.Core
{
    public struct PostSlug
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public string Slug { get; set; }

        public override string ToString() => $"{Year}/{Month}/{Day}/{Slug}";

        public PostSlug(int year, int month, int day, string slug)
        {
            Year = year;
            Month = month;
            Day = day;
            Slug = slug;
        }
    }
}
