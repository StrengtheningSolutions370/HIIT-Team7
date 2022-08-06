﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Team7.Models
{
    public class QualificationType
    {
        public QualificationType()
        {
            this.Qualification = new HashSet<Qualification>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int QualificationTypeID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public virtual ICollection<Qualification> Qualification { get; set; }
    }
}