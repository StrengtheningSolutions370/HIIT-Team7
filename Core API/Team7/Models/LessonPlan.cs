﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Team7.Models
{
    public class LessonPlan
    {
        public LessonPlan()
        {
            this.Schedule = new HashSet<Schedule>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LessonPlanID { get; set; }

        public virtual Exercise Exercise { get; set; }
        public virtual Lesson Lesson { get; set; }
        public virtual ICollection<Schedule> Schedule { get; set; }
    }
}