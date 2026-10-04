import os
import uuid
import datetime
import smtplib
from email.message import EmailMessage
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader

try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False

# Mailpit default local SMTP port
SMTP_HOST = "localhost"
SMTP_PORT = 1025

def get_templates_env():
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
    return Environment(loader=FileSystemLoader(templates_dir))

def generate_pdf_form(org_slug: str, fields: dict) -> bytes:
    if not WEASYPRINT_AVAILABLE:
        print("WeasyPrint not available, returning empty PDF.")
        return b"%PDF-1.4\n%EOF"
        
    env = get_templates_env()
    try:
        template = env.get_template('claim_form.html')
    except Exception:
        # Fallback raw HTML if template doesn't exist
        html_content = f"<h1>Claim Form for {org_slug}</h1>"
        for k, v in fields.items():
            html_content += f"<p><b>{k}:</b> {v}</p>"
        return HTML(string=html_content).write_pdf()
        
    html_out = template.render(org_slug=org_slug, fields=fields)
    return HTML(string=html_out).write_pdf()

def send_email_ticket(org_slug: str, to_address: str, fields: dict, evidence: dict, generate_pdf: bool = False) -> dict:
    """
    Creates a ticket by sending an email via SMTP (captured by Mailpit).
    """
    ticket_ref = f"EML-{uuid.uuid4().hex[:8].upper()}"
    
    msg = MIMEMultipart()
    msg['Subject'] = f"New Passage Submission [{ticket_ref}]"
    msg['From'] = "passage-dispatcher@localhost"
    msg['To'] = to_address
    
    # Body
    env = get_templates_env()
    try:
        template = env.get_template('email_body.html')
        body_text = template.render(org_slug=org_slug, ticket_ref=ticket_ref, fields=fields, evidence=evidence)
    except Exception:
        body_text = f"Ticket Ref: {ticket_ref}\n\nFields:\n{fields}\n\nEvidence:\n{evidence}"
        
    msg.attach(MIMEText(body_text, 'html'))
    
    # PDF Attachment
    if generate_pdf:
        pdf_bytes = generate_pdf_form(org_slug, fields)
        part = MIMEApplication(pdf_bytes, Name=f"claim_form_{ticket_ref}.pdf")
        part['Content-Disposition'] = f'attachment; filename="claim_form_{ticket_ref}.pdf"'
        msg.attach(part)
        
    # Send via SMTP
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email to {to_address} via {SMTP_HOST}:{SMTP_PORT}: {e}")
        
    return {
        "ticket_ref": ticket_ref,
        "status": "OPEN"
    }
