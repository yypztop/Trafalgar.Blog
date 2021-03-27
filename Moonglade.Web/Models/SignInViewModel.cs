﻿using System.ComponentModel.DataAnnotations;

namespace Moonglade.Web.Models
{
    public class SignInViewModel
    {
        [Required(ErrorMessage = "Please enter a username.")]
        [Display(Name = "Username")]
        [MinLength(2, ErrorMessage = "Username must be at least 2 characters"), MaxLength(32)]
        [RegularExpression("[a-z0-9]+", ErrorMessage = "Username must be lower case letters or numbers.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Please enter a password.")]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters"), MaxLength(32)]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", ErrorMessage = "Password must be minimum eight characters, at least one letter and one number")]
        public string Password { get; set; }
    }
}
