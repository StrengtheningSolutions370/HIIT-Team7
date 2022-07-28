using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team7.Models
{
    public class PasswordHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PasswordID { get; set; }
        [Required]
        public System.DateTime Date { get; set; }
        [Required]
        public string Hashed { get; set; }
        [Required]
        public string UserID { get; set; }
    }
}