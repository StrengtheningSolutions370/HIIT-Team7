//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Team7.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SESSION
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SESSION()
        {
            this.DATE_SESSION = new HashSet<DATE_SESSION>();
        }
    
        public int SESSION_ID { get; set; }
        public System.DateTime SESSION_START { get; set; }
        public System.DateTime SESSION_END { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DATE_SESSION> DATE_SESSION { get; set; }
    }
}
