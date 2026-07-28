import pandas as pd
import os

REQUIRED_COLUMNS = [
    "Full Name", "Email", "Phone", "Current Company", "Current Role", 
    "Current CTC", "Expected CTC", "Notice Period (Days)", "Work Mode", 
    "Willing to Relocate", "Preferred Roles", "Preferred Locations", "Skills"
]

data = [
    {
        "Full Name": "Alice Smith",
        "Email": "alice@example.com",
        "Phone": "9876543210",
        "Current Company": "TechSoft",
        "Current Role": "Frontend Developer",
        "Current CTC": 12.0,
        "Expected CTC": 18.0,
        "Notice Period (Days)": 30,
        "Work Mode": "Hybrid",
        "Willing to Relocate": "Yes",
        "Preferred Roles": "Senior Frontend Engineer, React Developer",
        "Preferred Locations": "Bangalore, Remote",
        "Skills": "React (Advanced), TypeScript (Intermediate), Next.js (Intermediate)"
    },
    {
        "Full Name": "Bob Jones",
        "Email": "bob@example.com",
        "Phone": "9876543211",
        "Current Company": "DataSystems",
        "Current Role": "Backend Developer",
        "Current CTC": 14.0,
        "Expected CTC": 20.0,
        "Notice Period (Days)": 60,
        "Work Mode": "Remote",
        "Willing to Relocate": "No",
        "Preferred Roles": "Backend Engineer, Python Developer",
        "Preferred Locations": "Remote, Pune",
        "Skills": "Python (Advanced), FastAPI (Advanced), PostgreSQL (Intermediate)"
    },
    {
        "Full Name": "Charlie Brown",
        "Email": "charlie@example.com",
        "Phone": "9876543212",
        "Current Company": "Startup X",
        "Current Role": "Full Stack Engineer",
        "Current CTC": 15.0,
        "Expected CTC": 22.0,
        "Notice Period (Days)": 15,
        "Work Mode": "On-site",
        "Willing to Relocate": "Yes",
        "Preferred Roles": "Full Stack Engineer",
        "Preferred Locations": "Hyderabad, Bangalore",
        "Skills": "React (Intermediate), Python (Intermediate), AWS (Beginner)"
    },
    {
        "Full Name": "David Wilson",
        "Email": "david@example.com",
        "Phone": "9876543213",
        "Current Company": "College",
        "Current Role": "Student",
        "Current CTC": 0.0,
        "Expected CTC": 6.0,
        "Notice Period (Days)": 0,
        "Work Mode": "Hybrid",
        "Willing to Relocate": "Yes",
        "Preferred Roles": "Junior Web Developer, Frontend Intern",
        "Preferred Locations": "Bangalore, Remote",
        "Skills": "HTML, CSS, JavaScript, React (Beginner)"
    }
]

df = pd.DataFrame(data, columns=REQUIRED_COLUMNS)

output_path = os.path.join(os.path.dirname(__file__), "sample_students.xlsx")
df.to_excel(output_path, index=False)
print(f"Created sample excel at {output_path}")
