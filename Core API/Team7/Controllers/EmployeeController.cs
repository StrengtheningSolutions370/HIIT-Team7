using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Team7.Models;
using Team7.Models.Repository;
using Team7.Services;
using Team7.ViewModels;

namespace Team7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepo EmployeeRepo;
        private readonly IEmployeeTypeRepo EmployeeTypeRepo;
        private readonly ITitleRepo TitleRepo;
        private readonly IQualificationRepo QualificationRepo;
        private readonly IScheduleRepo ScheduleRepo;
        private readonly ILessonRepo LessonRepo;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        public EmployeeController(IScheduleRepo ScheduleRepo, ILessonRepo LessonRepo, UserManager<AppUser> userManager, IEmployeeRepo employeeRepo, RoleManager<IdentityRole> roleManager, ITitleRepo TitleRepo, IEmployeeTypeRepo EmployeeTypeRepo, IQualificationRepo QualificationRepo)
        {
            this.ScheduleRepo = ScheduleRepo;
            this.LessonRepo = LessonRepo;
            this.EmployeeRepo = employeeRepo;
            this.TitleRepo = TitleRepo;
            this.EmployeeTypeRepo = EmployeeTypeRepo;
            this.QualificationRepo = QualificationRepo;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        //this endpoint can be uncommented and used to make a super user after re-migrations
        [HttpPost]
        [Route("createSuperUser")]
        public async Task<IActionResult> createSuperUser(UserViewModel userViewModel)
        {

            var role = "superuser";

            //check if role exists:
            var exists = await _roleManager.FindByNameAsync(role);
            if (exists == null)
            {
                //role does not exists yet:
                //create the role here:
                IdentityRole newRole = new IdentityRole
                {
                    Name = role
                };
                IdentityResult result = await _roleManager.CreateAsync(newRole);

            }

            var user = await _userManager.FindByNameAsync(userViewModel.EmailAddress);

            if (user == null)
            {
                //Create new user - no existing account with matching email address
                user = new AppUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = userViewModel.EmailAddress,
                    Email = userViewModel.EmailAddress,
                    PhoneNumber = userViewModel.phoneNumber,
                    FirstName = userViewModel.firstName,
                    LastName = userViewModel.lastName,
                };

                var result = await _userManager.CreateAsync(user, userViewModel.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, role);
                }

                if (result.Errors.Any())
                {
                    StatusCode(StatusCodes.Status500InternalServerError, "Internal error. Please contact support");
                }
            }
            else
            {
                return Forbid("Account with provided email address already exists");
            }
            return Ok("Super User created Successfully");
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("createAdmin")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "superuser")]
        public async Task<IActionResult> createAdmin()
        {

            var unix = timeStamp();

            var formCollection = await Request.ReadFormAsync();

            //1. convert employee back to an object and pull values 
            string s = formCollection.Keys.FirstOrDefault();
            string decode = HttpUtility.UrlDecode(s);
            var employee = JObject.Parse(decode);

            string EmployeeID = Guid.NewGuid().ToString(); //use this for creation and file storage
            string Name = employee["Name"].ToString();
            string Surname = employee["Surname"].ToString();
            string IDNumber = employee["IDNumber"].ToString();
            string Phone = employee["Phone"].ToString();
            string Email = employee["Email"].ToString();
            string TitleId = employee["TitleID"].ToString();
            string EmployeeTypeId = employee["EmployeeTypeID"].ToString();
            string QualificationID = employee["QualificationID"].ToString();

            //check if already exists:
            var flag = await _userManager.FindByEmailAsync(Email);
            if (flag != null)
            {
                StatusCode(StatusCodes.Status409Conflict, "User already exisit?"); //CHECKHERE
            }

            //check if role exisit
            var role = "admin";

            //check if role exists:
            var exists = await _roleManager.FindByNameAsync(role);
            if (exists == null)
            {
                //role does not exists yet:
                //create the role here:
                IdentityRole newRole = new IdentityRole
                {
                    Name = role
                };
                IdentityResult result = await _roleManager.CreateAsync(newRole);

            }

            //Create the user
            var user = await _userManager.FindByNameAsync(Email);

            if (user == null)
            {

                var emptitle = await this.TitleRepo._GetTitleIdAsync(Convert.ToInt32(TitleId));

                //Create new user - no existing account with matching email address
                user = new AppUser
                {
                    Id = EmployeeID,
                    UserName = Email,
                    Email = Email,
                    PhoneNumber = Phone,
                    FirstName = Name,
                    LastName = Surname,
                    Title = emptitle
                };

                //assign a password from generator
                string randomPassword = generatePassword();
                var result = await _userManager.CreateAsync(user, randomPassword);

                if (result.Succeeded)
                {

                    //create record to the Employee table:
                    Employee employeeRecord = new Employee
                    {
                        Photo = null,
                        Contract = null,
                        IDNumber = IDNumber,
                        AppUser = await _userManager.FindByNameAsync(Email),
                        EmployeeType = await this.EmployeeTypeRepo._GetEmployeeTypeIdAsync(Convert.ToInt32(EmployeeTypeId)),
                        Qualification = await this.QualificationRepo._GetQualificationIdAsync(Convert.ToInt32(QualificationID)),
                        UserID = EmployeeID
                    };
                    ///////////////////////////////////

                    await _userManager.AddToRoleAsync(user, role);

                    Email email = new Email();
                    var body = "<h1>Strengthening Solutions</h1> <br /> <hr>" +
                        "<p><strong>Email:</strong> " + Email + "</p>" +
                        "<p><strong>Password:</strong> " + randomPassword + "</p>" +
                        "<br /> <hr>";
                    try
                    {
                        //email the password to the user:
                        email.sendEmail(Email, "Strengthening Solutions", body);

                        ///////////////////////////////////////////////////
                        ///store files from FormData:

                        //store contract:
                        //config
                            var contract = formCollection.Files.First();
                            var contractFolder = Path.Combine("Resources", "Employees", "Contracts");
                            var contractPath = Path.Combine(Directory.GetCurrentDirectory(), contractFolder);
                            //storage
                            var contractFileName = ContentDispositionHeaderValue.Parse(EmployeeID).ToString() + "_" + unix + ".pdf";
                            //attach contract name to emp table
                            employeeRecord.Contract = contractFileName;
                            var contractFullPath = Path.Combine(contractPath, contractFileName);
                            using (var stream = new FileStream(contractFullPath, FileMode.Create))
                            {
                                contract.CopyTo(stream);
                            }

                            //check if photo to store:
                            if (formCollection.Files.Count == 2)
                            {
                                //get file
                                var photo = formCollection.Files[1];
                                //config
                                var photoFolder = Path.Combine("Resources", "Employees", "Images");
                                var photoPath = Path.Combine(Directory.GetCurrentDirectory(), photoFolder);
                                //storage
                                var extension = photo.ContentType.Split('/')[1];
                                var photoFileName = ContentDispositionHeaderValue.Parse(EmployeeID).ToString() + "_" + unix + "." + extension;
                                //attatch photo name to emp table
                                employeeRecord.Photo = photoFileName;
                                var photoFullPath = Path.Combine(photoPath, photoFileName);
                                using (var stream = new FileStream(photoFullPath, FileMode.Create))
                                {
                                    photo.CopyTo(stream);
                                }
                            }

                        //add employeeRecord to repo
                        this.EmployeeRepo.Add(employeeRecord);

                    }
                    catch (Exception ex)
                    {
                        StatusCode(StatusCodes.Status500InternalServerError, "Internal error. Please contact support" + ex.Message);
                    }

                }

                if (result.Errors.Any())
                {
                    StatusCode(StatusCodes.Status500InternalServerError, "Internal error. Please contact support");
                }

            }
            else
            {
                return Forbid("Account with provided email address already exists");
            }

            return Ok("Account created successfully");

        }

        static string generatePassword()
        {
            //ascii 33 - 122

            string output = "";
            for (int i = 0; i < 2; i++)
            {
                output += getCap();
                output += getLow();
                output += getSpecial();
                output += getDigit();
            }
            return output;
        }

        static int randomRange(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }

        static char getCap()
        {
            //65-90
            return (char) randomRange(65, 90);
        }

        static char getLow()
        {
            //97-122
            return (char) randomRange(97, 122);

        }

        static char getDigit()
        {
            //48-57
            return (char) randomRange(48, 58);
        }

        static char getSpecial()
        {
            //58-64
            return (char) randomRange(58, 64);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("token")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Token()
        {
            var header = HttpContext.Request.Headers["Authorization"][0];
            var token = header.Substring(header.IndexOf(" ") + 1);
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            string sub = jwt.Subject;
            //linking to query for the sub's role:

            var userRole = await _userManager.GetRolesAsync(await _userManager.FindByNameAsync( sub ));

            return Ok(new
            {
                role = userRole[0]
            });
        }

        //create a trainer or generalemployee
        [HttpPost, DisableRequestSizeLimit]
        [Route("createEmployee")]
        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "admin, superuser")]*/
        public async Task<IActionResult> createEmployee()
        {
            string unix = timeStamp(); //to stamp file creation

            var formCollection = await Request.ReadFormAsync();

            //1. convert employee back to an object and pull values 
            string s = formCollection.Keys.FirstOrDefault();
            string decode = HttpUtility.UrlDecode(s);
            var employee = JObject.Parse(decode);

            string EmployeeID = Guid.NewGuid().ToString(); //use this for creation and file storage
            string Name = employee["Name"].ToString();
            string Surname = employee["Surname"].ToString();
            string IDNumber = employee["IDNumber"].ToString();
            string Phone = employee["Phone"].ToString();
            string Email = employee["Email"].ToString();
            string TitleId = employee["TitleID"].ToString();
            string EmployeeTypeId = employee["EmployeeTypeID"].ToString();
            string QualificationID = employee["QualificationID"].ToString();
            string uvmRole = employee["role"].ToString();

            //check if already exists:
            var f = await _userManager.FindByEmailAsync(Email);
            if (f != null)
            {
                StatusCode(StatusCodes.Status409Conflict, "User already exisit?"); //CHECKHERE
            }

            string[] supportedRole = { "trainer", "generalemployee" };
            bool flag = false;
            foreach (var role in supportedRole)
                if (role == uvmRole)
                {
                    flag = true;
                    break;
                }
            if (!flag)
                return BadRequest(uvmRole + " is not supported");

            //check if role exists:
            var exists = await _roleManager.FindByNameAsync(uvmRole);
            if (exists == null)
            {
                //role does not exists yet:
                //create the role here:
                IdentityRole newRole = new IdentityRole
                {
                    Name = uvmRole
                };
                IdentityResult result = await _roleManager.CreateAsync(newRole);
            }

            //Create the user
            var user = await _userManager.FindByNameAsync(Email);

            if (user == null)
            {

                var emptitle = await this.TitleRepo._GetTitleIdAsync(Convert.ToInt32(TitleId));

                //Create new user - no existing account with matching email address
                user = new AppUser
                {
                    Id = EmployeeID,
                    UserName = Email,
                    Email = Email,
                    PhoneNumber = Phone,
                    FirstName = Name,
                    LastName = Surname,
                    Title = emptitle
                };

                //assign a password from generator
                string randomPassword = generatePassword();
                var result = await _userManager.CreateAsync(user, randomPassword);

                if (result.Succeeded)
                {

                    //create record to the Employee table:
                    Employee employeeRecord = new Employee
                    {
                        Photo = null,
                        Contract = null,
                        IDNumber = IDNumber,
                        AppUser = await _userManager.FindByNameAsync(Email),
                        EmployeeType = await this.EmployeeTypeRepo._GetEmployeeTypeIdAsync(Convert.ToInt32(EmployeeTypeId)),
                        Qualification = await this.QualificationRepo._GetQualificationIdAsync(Convert.ToInt32(QualificationID)),
                        UserID = EmployeeID
                    };
                    ///////////////////////////////////

                    await _userManager.AddToRoleAsync(user, uvmRole);

                    Email email = new Email();
                    var body = "<h1>Strengthening Solutions</h1> <br /> <hr>" +
                        "<p><strong>Email:</strong> " + Email + "</p>" +
                        "<p><strong>Password:</strong> " + randomPassword + "</p>" +
                        "<br /> <hr>";
                    try
                    {
                        //email the password to the user:
                        email.sendEmail(Email, "Strengthening Solutions", body);

                        ///////////////////////////////////////////////////
                        ///store files from FormData:

                        //store contract:
                        //config
                        var contract = formCollection.Files.First();
                        var contractFolder = Path.Combine("Resources", "Employees", "Contracts");
                        var contractPath = Path.Combine(Directory.GetCurrentDirectory(), contractFolder);
                        //storage
                        var contractFileName = ContentDispositionHeaderValue.Parse(EmployeeID).ToString() + "_" + unix + ".pdf";
                        //attach contract name to emp table
                        employeeRecord.Contract = contractFileName;
                        var contractFullPath = Path.Combine(contractPath, contractFileName);
                        using (var stream = new FileStream(contractFullPath, FileMode.Create))
                        {
                            contract.CopyTo(stream);
                        }

                        //check if photo to store:
                        if (formCollection.Files.Count == 2)
                        {
                            //get file
                            var photo = formCollection.Files[1];
                            //config
                            var photoFolder = Path.Combine("Resources", "Employees", "Images");
                            var photoPath = Path.Combine(Directory.GetCurrentDirectory(), photoFolder);
                            //storage
                            var extension = photo.ContentType.Split('/')[1];
                            var photoFileName = ContentDispositionHeaderValue.Parse(EmployeeID).ToString() + "_" + unix + "." + extension;
                            //attatch photo name to emp table
                            employeeRecord.Photo = photoFileName;
                            var photoFullPath = Path.Combine(photoPath, photoFileName);
                            using (var stream = new FileStream(photoFullPath, FileMode.Create))
                            {
                                photo.CopyTo(stream);
                            }
                        }

                        //add employeeRecord to repo
                        this.EmployeeRepo.Add(employeeRecord);

                    }
                    catch (Exception ex)
                    {
                        StatusCode(StatusCodes.Status500InternalServerError, "Internal error. Please contact support");
                    }

                }

                if (result.Errors.Any())
                {
                    StatusCode(StatusCodes.Status500InternalServerError, "Internal error. Please contact support");
                }

            }
            else
            {
                return Forbid("Account with provided email address already exists");
            }
            return Ok("Account created successfully");

        }

        // PUT api/employees/update/5
        [HttpPost, DisableRequestSizeLimit]
        [Route("update")]
        public async Task<IActionResult> PutEmployee()
        {

            string unix = timeStamp(); //to stamp file creation

            var formCollection = await Request.ReadFormAsync();

            //1. convert employee back to an object and pull values 
            string s = formCollection.Keys.FirstOrDefault();
            string decode = HttpUtility.UrlDecode(s);
            var employee = JObject.Parse(decode);
            string Name = employee["Name"].ToString();
            string Surname = employee["Surname"].ToString();
            string IDNumber = employee["IDNumber"].ToString();
            string Phone = employee["Phone"].ToString();
            string Email = employee["Email"].ToString();
            string TitleId = employee["TitleID"].ToString();
            string EmployeeTypeId = employee["EmployeeTypeID"].ToString();
            string QualificationID = employee["QualificationID"].ToString();
            string uvmRole = employee["role"].ToString();
            string AspId = employee["EmployeeID"].ToString();

            bool SwapPhoto = Convert.ToBoolean(employee["SwapPhoto"]);
            bool SwapContract = Convert.ToBoolean(employee["SwapContract"]);

            //fetch records to edit
            var editEmployee = await this.EmployeeRepo.GetByUserIdAsync(AspId);
            var editAspUser = await _userManager.FindByIdAsync(AspId);

            //update the employee table:
            editEmployee.IDNumber = IDNumber;
            editEmployee.Qualification = await QualificationRepo._GetQualificationIdAsync(Convert.ToInt32(QualificationID));
            editEmployee.EmployeeType = await EmployeeTypeRepo._GetEmployeeTypeIdAsync(Convert.ToInt32(EmployeeTypeId));
            editEmployee.UserID = editAspUser.Id;

            //update the AspUser table:
            editAspUser.FirstName = Name;
            editAspUser.LastName = Surname;
            editAspUser.PhoneNumber = Phone;
            editAspUser.Email = Email;
            editAspUser.Title = await TitleRepo._GetTitleIdAsync(Convert.ToInt32(TitleId));

            bool RemovePhoto = Convert.ToBoolean(employee["RemovePhoto"]);

            //check for remove photo
            if (RemovePhoto)
            {
                //delete photo and set string in table to null:
                deletePhoto(editEmployee.Photo);
                editEmployee.Photo = null;

            } else
            {

                //photo is not being removed:
                if (SwapPhoto) //check if photo is being swapped or left alone
                {
                    try
                    {
                        if(editEmployee.Photo !=null)
                        deletePhoto(editEmployee.Photo);
                    } catch (Exception ex)
                    {
                        
                        StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
                    }

                    //assume photo is in index 0:
                    var photo = formCollection.Files.FirstOrDefault();

                    //try determine which file is the photo:
                    if (SwapContract)
                    {
                        //photo would be in index 1:
                        photo = formCollection.Files[1];

                    }

                    //store new photo:
                    //get file
                    //config
                    var photoFolder = Path.Combine("Resources", "Employees", "Images");
                    var photoPath = Path.Combine(Directory.GetCurrentDirectory(), photoFolder);
                    //storage
                    var extension = photo.ContentType.Split('/')[1];
                    var photoFileName = ContentDispositionHeaderValue.Parse(editAspUser.Id).ToString() + "_" + unix + "." + extension;
                    editEmployee.Photo = photoFileName; //update for the extension

                    var photoFullPath = Path.Combine(photoPath, photoFileName);
                    using (var stream = new FileStream(photoFullPath, FileMode.Create))
                    {
                        photo.CopyTo(stream);
                    }

                }

            }

            if (SwapContract)
            {
                //delete old contract
                try
                {
                    deletePhoto(editEmployee.Contract);
                }
                catch (Exception ex)
                {
                    StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
                }

                //contract would be in index 0:
                var contract = formCollection.Files.First();
                var contractFolder = Path.Combine("Resources", "Employees", "Contracts");
                var contractPath = Path.Combine(Directory.GetCurrentDirectory(), contractFolder);
                //storage
                var contractFileName = ContentDispositionHeaderValue.Parse(editEmployee.UserID).ToString() + "_" + unix + ".pdf";
                editEmployee.Contract = contractFileName;
                var contractFullPath = Path.Combine(contractPath, contractFileName);
                using (var stream = new FileStream(contractFullPath, FileMode.Create))
                {
                    contract.CopyTo(stream);
                }
            }
            EmployeeRepo.Update(editEmployee);
            EmployeeRepo.SaveChangesAsync();
            await _userManager.UpdateAsync(editAspUser);

            return Ok();
        }

        static string timeStamp()
        {
            return DateTimeOffset.Now.ToUnixTimeSeconds().ToString();
        }

        static void deletePhoto(string fname)
        {
            var imageFolder = Path.Combine("Resources", "Employees", "Images");
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), imageFolder, fname);
            System.IO.File.Delete(imagePath);
        }

        static void deleteContract(string fname)
        {
            try
            {
                var contractFolder = Path.Combine("Resources", "Employees", "Contracts");
                var contractPath = Path.Combine(Directory.GetCurrentDirectory(), contractFolder, fname);
                System.IO.File.Delete(contractPath);
            }
            catch (Exception ex)
            {
                //file deletion failed
                Console.WriteLine(ex.Message);
            }
        }

        // DELETE api/Employee/delete/5
        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteEmployeeType(string id)
        {
            //Load employee:
            var employeeRecord = await EmployeeRepo.GetByUserIdAsync(id);
            var lessons = employeeRecord.Lesson;
            var schedule = employeeRecord.Schedule;

            if (lessons.Count != 0 || schedule.Count != 0)
            {
                StatusCode(StatusCodes.Status409Conflict, new
                {
                    error = "Employee cannot be deleted?", //CHECKHERE
                    employee = employeeRecord
                }); //return employss with loaded for the Associative modal
            }

            //employee can be deleted as they have no links:
            //delete from employee table first
            employeeRecord.EmployeeID = employeeRecord.EmployeeID;
            try
            {
                EmployeeRepo.Delete(employeeRecord);
                try
                {
                    deleteContract(employeeRecord.Contract);
                } catch (Exception e)
                {

                }
                try
                {
                    deletePhoto(employeeRecord.Photo);
                } catch(Exception e) {

                }
            } catch (Exception ex)
            {
                return Forbid(ex.Message);
            }

            await EmployeeRepo.SaveChangesAsync();
            _userManager.DeleteAsync(employeeRecord.AppUser);

            return Ok("Employee deleted successfully");
        }


        // GET: api/Employee/getAll
        [HttpGet]
        [Route("getAll")]
        public async Task<IActionResult> GetEmployees()
        {
            try
            {
                var employeeList = await EmployeeRepo.GetAllEmployeesAsync();
                if (employeeList == null) return Ok(0);
                return Ok(employeeList);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }

        // GET: api/Employee/getMatch/{input}
        [HttpGet]
        [Route("getMatch")]
        public async Task<IActionResult> GetMatchingEmployees(string input)
        {
            try
            {
                var employees = await EmployeeRepo.GetEmployeesAsync(input);
                if (employees == null) return Ok(0);
                return Ok(employees);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }

        }

        [HttpGet]
        [Route("exists")]
        public async Task<IActionResult> EmployeeExists(int id)
        {
            try
            {
                var qualificationType = await EmployeeRepo._GetEmployeeIdAsync(id);
                if (qualificationType == null) return Ok(0);
                return Ok(qualificationType);
            }
            catch (Exception err)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, err.Message);
            }
        }
    }
}
