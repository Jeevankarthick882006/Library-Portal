# build_word_doc.py - Generates a professional Microsoft Word (.docx) document containing all project source codes
import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Initialize Document
doc = Document()

# Set standard 1-inch margins
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Helper function to add background shading to XML element (for code blocks)
def set_cell_background(cell, fill_hex="F8F9FA"):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

# Helper function to set subtle borders on table cell
def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

# Helper to add a formatted code block inside a shaded single-cell table
def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F3F4F6")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    
    run = p.add_run(code_text.strip())
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    
    # Add small spacing after the table
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(12)

# ==================== COVER PAGE ====================
title_p = doc.add_paragraph()
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_p.paragraph_format.space_before = Pt(60)

run_col = title_p.add_run("SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY\n")
run_col.font.name = 'Times New Roman'
run_col.font.size = Pt(15)
run_col.font.bold = True
run_col.font.color.rgb = RGBColor(139, 0, 0)

run_sub = title_p.add_run("Kuniamuthur, Coimbatore – 641008\n\n\n\n")
run_sub.font.name = 'Times New Roman'
run_sub.font.size = Pt(10)
run_sub.font.color.rgb = RGBColor(100, 100, 100)

run_title = title_p.add_run("LIBRARY PORTAL\n")
run_title.font.name = 'Times New Roman'
run_title.font.size = Pt(24)
run_title.font.bold = True
run_title.font.color.rgb = RGBColor(15, 23, 42)

run_type = title_p.add_run("COMPLETE SOURCE CODE REPOSITORY\n\n\n\n")
run_type.font.name = 'Times New Roman'
run_type.font.size = Pt(13)
run_type.font.bold = True
run_type.font.color.rgb = RGBColor(70, 70, 70)

sub_p = doc.add_paragraph()
sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
sub_p.paragraph_format.space_after = Pt(80)

r_by = sub_p.add_run("Submitted by\n")
r_by.font.name = 'Times New Roman'
r_by.font.size = Pt(12)
r_by.italic = True

r_name = sub_p.add_run("JEEVAN KARTHICK\n")
r_name.font.name = 'Times New Roman'
r_name.font.size = Pt(14)
r_name.font.bold = True

r_reg = sub_p.add_run("Register No: 2403727710621107\n\n")
r_reg.font.name = 'Times New Roman'
r_reg.font.size = Pt(12)

r_dept = sub_p.add_run("Department of Electronics and Communication Engineering\n")
r_dept.font.name = 'Times New Roman'
r_dept.font.size = Pt(12)
r_dept.font.bold = True

r_year = sub_p.add_run("Academic Year: 2026")
r_year.font.name = 'Times New Roman'
r_year.font.size = Pt(12)

doc.add_page_break()

# ==================== TABLE OF CONTENTS ====================
toc_h = doc.add_heading("Table of Contents", level=1)
toc_h.runs[0].font.name = 'Times New Roman'
toc_h.runs[0].font.color.rgb = RGBColor(15, 23, 42)

files_to_include = [
    # 1. Root
    ("Root Configuration", [
        ("package.json", "package.json", "Root dependencies and concurrent startup scripts"),
    ]),
    
    # 2. Server Configuration & Database
    ("Backend: Server Entry & Database Configuration", [
        ("server/package.json", "server/package.json", "Backend dependencies (Express, Mongoose, JWT, bcrypt)"),
        ("server/.env", "server/.env", "Environment configuration and secrets"),
        ("server/server.js", "server/server.js", "Express application entry point and middleware"),
        ("server/config/db.js", "server/config/db.js", "Mongoose MongoDB connection configuration"),
        ("server/seed.js", "server/seed.js", "Starter database seeder for users, books, and loans"),
    ]),
    
    # 3. Server Models
    ("Backend: MongoDB Mongoose Schemas", [
        ("server/models/User.js", "server/models/User.js", "User & Member schema with bcrypt password hashing"),
        ("server/models/Book.js", "server/models/Book.js", "Book inventory schema with copy tracking"),
        ("server/models/Loan.js", "server/models/Loan.js", "Circulation loan schema with due dates and fines"),
        ("server/models/Notification.js", "server/models/Notification.js", "In-app patron notifications schema"),
    ]),
    
    # 4. Server Middleware
    ("Backend: Middleware", [
        ("server/middleware/authMiddleware.js", "server/middleware/authMiddleware.js", "JWT verification and role-based authorization guard"),
    ]),
    
    # 5. Server Controllers
    ("Backend: Business Logic Controllers", [
        ("server/controllers/authController.js", "server/controllers/authController.js", "Authentication, registration, login, and JWT token issuance"),
        ("server/controllers/bookController.js", "server/controllers/bookController.js", "Book catalog CRUD, search regex, and category filtering"),
        ("server/controllers/loanController.js", "server/controllers/loanController.js", "Circulation lending, stock decrement/increment, and returns"),
        ("server/controllers/memberController.js", "server/controllers/memberController.js", "Member management and circulation auditing"),
        ("server/controllers/dashboardController.js", "server/controllers/dashboardController.js", "Aggregated operational metrics for staff and members"),
        ("server/controllers/notificationController.js", "server/controllers/notificationController.js", "In-app alert retrieval and mark-as-read endpoints"),
    ]),
    
    # 6. Server Routes
    ("Backend: Express REST API Routes", [
        ("server/routes/authRoutes.js", "server/routes/authRoutes.js", "Auth endpoints (/api/auth/register, login, profile)"),
        ("server/routes/bookRoutes.js", "server/routes/bookRoutes.js", "Book endpoints (/api/books)"),
        ("server/routes/loanRoutes.js", "server/routes/loanRoutes.js", "Loan circulation endpoints (/api/loans)"),
        ("server/routes/memberRoutes.js", "server/routes/memberRoutes.js", "Member directory endpoints (/api/members)"),
        ("server/routes/dashboardRoutes.js", "server/routes/dashboardRoutes.js", "Dashboard metrics endpoint (/api/dashboard)"),
        ("server/routes/notificationRoutes.js", "server/routes/notificationRoutes.js", "Alert endpoints (/api/notifications)"),
    ]),
    
    # 7. Frontend Config & Core
    ("Frontend: Configuration & Application Entry", [
        ("client/package.json", "client/package.json", "Frontend dependencies (React 18, Vite, Bootstrap 5)"),
        ("client/vite.config.js", "client/vite.config.js", "Vite build tool and backend API proxy settings"),
        ("client/index.html", "client/index.html", "HTML5 entry template with Google Fonts"),
        ("client/src/index.css", "client/src/index.css", "Custom CSS styling and card hover transitions"),
        ("client/src/main.jsx", "client/src/main.jsx", "React DOM root initialization and Bootstrap import"),
        ("client/src/App.jsx", "client/src/App.jsx", "React Router setup with role-protected routes"),
    ]),
    
    # 8. Frontend Services, Hooks & Context
    ("Frontend: Services, Hooks & Global State", [
        ("client/src/services/api.js", "client/src/services/api.js", "Centralized Axios client with JWT request interceptor"),
        ("client/src/hooks/useDebounce.js", "client/src/hooks/useDebounce.js", "Custom hook for 400ms debounced search optimization"),
        ("client/src/context/AuthContext.jsx", "client/src/context/AuthContext.jsx", "Global authentication context and session persistence"),
    ]),
    
    # 9. Frontend Components
    ("Frontend: Reusable UI Components", [
        ("client/src/components/Navbar.jsx", "client/src/components/Navbar.jsx", "Responsive navigation bar with notification popover"),
        ("client/src/components/Footer.jsx", "client/src/components/Footer.jsx", "Standard application footer"),
        ("client/src/components/ProtectedRoute.jsx", "client/src/components/ProtectedRoute.jsx", "Client-side route guard checking authentication and roles"),
        ("client/src/components/StatCard.jsx", "client/src/components/StatCard.jsx", "Dashboard metric card component"),
    ]),
    
    # 10. Frontend Pages
    ("Frontend: Application Pages", [
        ("client/src/pages/Home.jsx", "client/src/pages/Home.jsx", "Home landing page with hero banner and top titles"),
        ("client/src/pages/Login.jsx", "client/src/pages/Login.jsx", "Authentication login page with 1-Click demo buttons"),
        ("client/src/pages/Register.jsx", "client/src/pages/Register.jsx", "Member registration form"),
        ("client/src/pages/Dashboard.jsx", "client/src/pages/Dashboard.jsx", "Role-aware operations dashboard for staff and members"),
        ("client/src/pages/BooksList.jsx", "client/src/pages/BooksList.jsx", "Catalog directory with debounced search & category filtering"),
        ("client/src/pages/BookDetails.jsx", "client/src/pages/BookDetails.jsx", "Detailed book view and 1-click borrow button"),
        ("client/src/pages/BookForm.jsx", "client/src/pages/BookForm.jsx", "Add / Edit catalog entry form for librarians"),
        ("client/src/pages/LoansList.jsx", "client/src/pages/LoansList.jsx", "Loan circulation ledger, checkout modal, and returns"),
        ("client/src/pages/MembersList.jsx", "client/src/pages/MembersList.jsx", "Member directory and status updater"),
        ("client/src/pages/Profile.jsx", "client/src/pages/Profile.jsx", "Patron profile settings and personal loan history"),
    ])
]

# Write Table of Contents items
toc_num = 1
for category_title, file_list in files_to_include:
    p_cat = doc.add_paragraph()
    p_cat.paragraph_format.space_before = Pt(8)
    p_cat.paragraph_format.space_after = Pt(2)
    r = p_cat.add_run(f"{category_title}")
    r.font.name = 'Times New Roman'
    r.font.bold = True
    r.font.size = Pt(11)
    
    for display_name, rel_path, desc in file_list:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.left_indent = Inches(0.25)
        p_item.paragraph_format.space_after = Pt(2)
        r_num = p_item.add_run(f"{toc_num}. {display_name}")
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(10)
        r_num.font.bold = True
        
        r_desc = p_item.add_run(f" — {desc}")
        r_desc.font.name = 'Times New Roman'
        r_desc.font.size = Pt(9.5)
        r_desc.font.color.rgb = RGBColor(100, 100, 100)
        toc_num += 1

doc.add_page_break()

# ==================== SOURCE CODE SECTIONS ====================
sec_num = 1
for category_title, file_list in files_to_include:
    # Major Section Header
    cat_h = doc.add_heading(category_title, level=1)
    cat_h.runs[0].font.name = 'Times New Roman'
    cat_h.runs[0].font.color.rgb = RGBColor(30, 41, 59)
    cat_h.paragraph_format.space_before = Pt(16)
    cat_h.paragraph_format.space_after = Pt(8)
    
    for display_name, rel_path, desc in file_list:
        file_h = doc.add_heading(f"{sec_num}. {display_name}", level=2)
        file_h.runs[0].font.name = 'Times New Roman'
        file_h.runs[0].font.color.rgb = RGBColor(15, 23, 42)
        file_h.paragraph_format.space_before = Pt(10)
        file_h.paragraph_format.space_after = Pt(2)
        
        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_after = Pt(6)
        r_desc = p_desc.add_run(f"Description: {desc} | Path: {rel_path}")
        r_desc.font.name = 'Times New Roman'
        r_desc.font.size = Pt(9.5)
        r_desc.font.italic = True
        r_desc.font.color.rgb = RGBColor(71, 85, 105)
        
        # Read file content
        if os.path.exists(rel_path):
            with open(rel_path, 'r', encoding='utf-8') as f:
                code_content = f.read()
        else:
            code_content = f"// File {rel_path} not found"
            
        add_code_block(doc, code_content)
        sec_num += 1

# Output paths
output_filename = "Library_Portal_Complete_Source_Code.docx"
output_path = os.path.abspath(output_filename)
doc.save(output_path)
print(f"SUCCESS: Created Word document at: {output_path}")

# Also copy to Downloads and Desktop
import shutil
user_profile = os.environ.get('USERPROFILE', '')
if user_profile:
    downloads_path = os.path.join(user_profile, 'Downloads', output_filename)
    shutil.copyfile(output_path, downloads_path)
    print(f"SUCCESS: Copied to Downloads: {downloads_path}")
    
    desktop_onedrive = os.path.join(user_profile, 'OneDrive', 'Desktop', output_filename)
    desktop_normal = os.path.join(user_profile, 'Desktop', output_filename)
    if os.path.exists(os.path.dirname(desktop_onedrive)):
        shutil.copyfile(output_path, desktop_onedrive)
        print(f"SUCCESS: Copied to Desktop: {desktop_onedrive}")
    elif os.path.exists(os.path.dirname(desktop_normal)):
        shutil.copyfile(output_path, desktop_normal)
        print(f"SUCCESS: Copied to Desktop: {desktop_normal}")
