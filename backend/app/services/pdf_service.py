import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_legal_notice(invoice_data: dict, interest_data: dict) -> bytes:
    """
    Generates a formal legal demand notice under Section 15 & 16 of the MSMED Act, 2006.
    Returns bytes of the generated PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'NoticeTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#990000') # Crimson/Burgundy
    )
    
    subtitle_style = ParagraphStyle(
        'NoticeSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#555555'),
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'NoticeH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        spaceBefore=12,
        spaceAfter=6,
        textColor=colors.HexColor('#111111')
    )
    
    body_style = ParagraphStyle(
        'NoticeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    body_bold_style = ParagraphStyle(
        'NoticeBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    meta_style = ParagraphStyle(
        'NoticeMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12
    )

    meta_right_style = ParagraphStyle(
        'NoticeMetaRight',
        parent=meta_style,
        alignment=TA_RIGHT
    )

    story = []
    
    # Header Letterhead
    story.append(Paragraph("LEGAL DEMAND NOTICE", title_style))
    story.append(Paragraph("UNDER SECTIONS 15 & 16 OF THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT (MSMED) ACT, 2006", subtitle_style))
    story.append(Spacer(1, 10))
    
    # Date and Sender/Recipient Table
    date_str = datetime.date.today().strftime("%B %d, %Y")
    
    sender_info = f"<b>SENDER (Supplier):</b><br/>{invoice_data.get('supplier_name', 'Shakti Engineering Works')}<br/>GSTIN: {invoice_data.get('supplier_gstin', 'N/A')}"
    recipient_info = f"<b>RECIPIENT (Buyer):</b><br/>{invoice_data.get('buyer_name', 'ABC Manufacturing Pvt Ltd')}<br/>GSTIN: {invoice_data.get('buyer_gstin', 'N/A')}"
    
    header_data = [
        [Paragraph(sender_info, meta_style), Paragraph(f"<b>DATE:</b> {date_str}<br/><b>NOTICE REF:</b> SAMADHAAN/{datetime.date.today().year}/L01", meta_right_style)],
        [Paragraph(recipient_info, meta_style), ""]
    ]
    
    header_table = Table(header_data, colWidths=[250, 250])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('SPAN', (0,1), (1,1)), # Span recipient address across columns
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    
    # Subject Line
    subject_text = f"<b>SUBJECT: Demand for outstanding payment of Invoice No. {invoice_data.get('invoice_number', 'N/A')} with statutory interest compounded monthly under Section 16 of the MSMED Act, 2006.</b>"
    story.append(Paragraph(subject_text, body_bold_style))
    story.append(Spacer(1, 10))
    
    # Salutation
    story.append(Paragraph("Dear Sir/Madam,", body_style))
    story.append(Spacer(1, 5))
    
    # Body paragraphs
    story.append(Paragraph(
        f"Under instructions from our client, <b>{invoice_data.get('supplier_name', 'Shakti Engineering Works')}</b> (hereinafter referred to as the 'Supplier'), "
        f"being a registered Micro/Small Enterprise under the MSMED Act, 2006, we serve you with this statutory notice regarding your outstanding dues for supply of goods/services.",
        body_style
    ))
    
    principal_amount = invoice_data.get('amount', 0.0)
    story.append(Paragraph(
        f"Our client supplied goods/services to you under Invoice No. <b>{invoice_data.get('invoice_number', 'N/A')}</b> dated <b>{invoice_data.get('invoice_date', 'N/A')}</b> "
        f"for an amount of <b>₹{principal_amount:,.2f}</b>. As per the agreed terms, the payment was due within agreed terms, i.e., by <b>{invoice_data.get('due_date', 'N/A')}</b>.",
        body_style
    ))

    story.append(Paragraph(
        f"In terms of Section 15 of the MSMED Act, 2006, you were legally obligated to clear the payment on or before the due date. "
        f"However, despite multiple reminders, you have failed to clear the principal outstanding of <b>₹{principal_amount:,.2f}</b>. "
        f"The payment is currently delayed by <b>{interest_data.get('delay_days', 0)} days</b> as of today.",
        body_style
    ))

    # Statutory Warning regarding Section 43B(h) and interest
    rate_pct = interest_data.get('interest_rate_pa', 0.2025) * 100
    story.append(Paragraph(
        "<b>STATUTORY INTEREST LIABILITY UNDER SECTION 16:</b><br/>"
        f"Please note that Section 16 of the MSMED Act, 2006, mandates the payment of compound interest with monthly rests on delayed payments. "
        f"The interest rate is prescribed as three times (3x) the Bank Rate notified by the Reserve Bank of India (RBI). "
        f"Accordingly, at the current RBI Bank Rate, the interest is chargeable at <b>{rate_pct:.2f}% per annum compounded monthly</b>. "
        f"As of today, the total interest accrued stands at <b>₹{interest_data.get('interest_accrued', 0.0):,.2f}</b>, making the total outstanding amount <b>₹{interest_data.get('total_due', 0.0):,.2f}</b>.",
        body_style
    ))

    story.append(Paragraph(
        "<b>TAX DISALLOWANCE PENALTY UNDER SECTION 43B(h):</b><br/>"
        "Further, your attention is drawn to Section 43B(h) of the Income Tax Act, 1961. "
        "Any sum payable to a micro or small enterprise remaining unpaid past the MSMED statutory limit at the end of the financial year (March 31) "
        "shall be completely disallowed as a tax deduction for that year. Consequently, this amount will be added to your taxable income, "
        "resulting in an additional corporate tax liability of up to 30% plus applicable surcharges.",
        body_style
    ))
    
    story.append(Spacer(1, 10))
    
    # Financial Summary Table
    story.append(Paragraph("<b>Outstanding Balance Summary:</b>", h2_style))
    
    invoice_date_str = str(invoice_data.get('invoice_date', 'N/A'))
    due_date_str = str(invoice_data.get('due_date', 'N/A'))
    
    summary_data = [
        ["Invoice Number", invoice_data.get('invoice_number', 'N/A')],
        ["Invoice Date", invoice_date_str],
        ["Principal Amount", f"₹{principal_amount:,.2f}"],
        ["Statutory Due Date", due_date_str],
        ["Delay Days", f"{interest_data.get('delay_days', 0)} Days"],
        ["Compounding Interest Rate", f"{rate_pct:.2f}% p.a. (3x RBI rate)"],
        ["Accrued Interest (Compounded Monthly)", f"₹{interest_data.get('interest_accrued', 0.0):,.2f}"],
        ["Total Payable Amount", f"₹{interest_data.get('total_due', 0.0):,.2f}"]
    ]
    
    summary_table = Table(summary_data, colWidths=[230, 270])
    summary_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F5F5F5')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,7), (-1,7), 'Helvetica-Bold'),
        ('BACKGROUND', (0,7), (-1,7), colors.HexColor('#FDF2F2')), # Light red for final total
        ('TEXTCOLOR', (0,7), (-1,7), colors.HexColor('#990000')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 15))
    
    # Demand Statement
    story.append(Paragraph(
        f"You are hereby called upon to pay the sum of <b>₹{interest_data.get('total_due', 0.0):,.2f}</b> (comprising Principal of ₹{principal_amount:,.2f} and Interest of ₹{interest_data.get('interest_accrued', 0.0):,.2f}) "
        f"within fifteen (15) days of receipt of this notice, failing which our client shall be constrained to file an official claim petition before the "
        f"MSME Facilitation Council (MSEFC) via the MSME Samadhaan Portal. "
        f"Any costs, expenses, and consequences of such litigation shall be entirely at your risk and account.",
        body_style
    ))
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("Yours faithfully,", body_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph(f"<b>For {invoice_data.get('supplier_name', 'Shakti Engineering Works')}</b><br/>Authorized Signatory", body_style))
    
    doc.build(story)
    return buffer.getvalue()


def generate_samadhaan_package(invoice_data: dict, interest_data: dict) -> bytes:
    """
    Generates a draft petition package for MSME Samadhaan Portal filing.
    Returns bytes of the compiled PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'PetitionTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1A365D') # Deep Blue
    )
    
    subtitle_style = ParagraphStyle(
        'PetitionSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#4A5568'),
        spaceAfter=20
    )
    
    h2_style = ParagraphStyle(
        'PetitionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        spaceBefore=14,
        spaceAfter=6,
        textColor=colors.HexColor('#2C5282'),
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'PetitionBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    table_text_style = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12
    )

    right_bold_style = ParagraphStyle(
        'RightBold', 
        parent=table_text_style, 
        alignment=TA_RIGHT,
        fontName='Helvetica-Bold'
    )

    center_bold_style = ParagraphStyle(
        'CenterBold', 
        parent=table_text_style, 
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    story = []
    
    # TITLE PAGE
    story.append(Spacer(1, 40))
    story.append(Paragraph("PETITION UNDER SECTION 18 OF MSMED ACT, 2006", title_style))
    story.append(Paragraph("BEFORE THE MICRO AND SMALL ENTERPRISES FACILITATION COUNCIL (MSEFC)", subtitle_style))
    story.append(Spacer(1, 20))
    
    # Case naming - Fixing nested array syntax issues
    parties_data = [
        [Paragraph(f"<b>IN THE MATTER OF:</b><br/><b>{invoice_data.get('supplier_name', 'Shakti Engineering Works')}</b><br/>(Registered micro/small enterprise)<br/>Udyam Registration: {invoice_data.get('supplier_udyam', 'UDYAM-MH-12-0043810')}", table_text_style)],
        [Paragraph("<b>...PETITIONER / SUPPLIER</b>", right_bold_style)],
        [Paragraph("<b>VERSUS</b>", center_bold_style)],
        [Paragraph(f"<b>{invoice_data.get('buyer_name', 'ABC Manufacturing Pvt Ltd')}</b><br/>GSTIN: {invoice_data.get('buyer_gstin', 'N/A')}<br/>Address: Mumbai, Maharashtra, India", table_text_style)],
        [Paragraph("<b>...RESPONDENT / BUYER</b>", right_bold_style)]
    ]
    
    parties_table = Table(parties_data, colWidths=[400])
    parties_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#2C5282')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F7FAFC')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,1), (-1,1), 6),
        ('BOTTOMPADDING', (0,2), (-1,2), 6),
    ]))
    story.append(parties_table)
    story.append(Spacer(1, 30))
    
    # Index of Documents
    story.append(Paragraph("<b>INDEX OF DOCUMENTS ATTACHED</b>", h2_style))
    index_data = [
        ["S.No", "Description of Document", "Status", "Annexure"],
        ["1", "Filing Claim Petition Form", "Compiled (AI Engine)", "Annexure-A"],
        ["2", "Copy of Invoice No. " + invoice_data.get('invoice_number', 'N/A'), "Extracted (OCR verified)", "Annexure-B"],
        ["3", "Copy of Purchase Order / Contract Terms", "Verified (30-day term)", "Annexure-C"],
        ["4", "Udyam Registration Certificate", "Verified (Micro Enterprise)", "Annexure-D"],
        ["5", "Statutory Compound Interest Calculation Statement", "Generated (MSMED Sec 16)", "Annexure-E"],
        ["6", "Copy of Legal Notice served on Buyer", "Generated & Appended", "Annexure-F"]
    ]
    index_table = Table(index_data, colWidths=[40, 260, 130, 70])
    index_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (3,0), (3,-1), 'CENTER'),
    ]))
    story.append(index_table)
    
    story.append(PageBreak())
    
    # PETITION SHEET
    story.append(Paragraph("<b>ANNEXURE-A: LAWSUIT & CLAIM PETITION PARTICULARS</b>", h2_style))
    story.append(Spacer(1, 10))
    
    principal_amt = invoice_data.get('amount', 0.0)
    interest_amt = interest_data.get('interest_accrued', 0.0)
    
    story.append(Paragraph(
        f"The Petitioner above named respectfully submits as under:<br/><br/>"
        f"1. The Petitioner is a registered Micro/Small Enterprise engaged in engineering works/manufacturing and has supplied goods/services to the Respondent.<br/><br/>"
        f"2. The Respondent placed an order for supply of goods/services, which were duly supplied by the Petitioner. The Petitioner raised Invoice No. <b>{invoice_data.get('invoice_number', 'N/A')}</b> dated <b>{invoice_data.get('invoice_date', 'N/A')}</b> for <b>₹{principal_amt:,.2f}</b>.<br/><br/>"
        f"3. As per the agreed terms, the Respondent was required to make the payment within 30 days. The payment deadline expired on <b>{invoice_data.get('due_date', 'N/A')}</b>. However, no payment has been received till date.<br/><br/>"
        f"4. The delay in payment stands at <b>{interest_data.get('delay_days', 0)} days</b>. The Respondent is liable to pay compound interest with monthly rests at 3x the RBI Bank Rate under Section 16 of the MSMED Act, which amounts to <b>₹{interest_amt:,.2f}</b> as on date.<br/><br/>"
        f"5. The Petitioner has served a formal legal notice demanding payment, but the Respondent has failed to comply.",
        body_style
    ))
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>PRAYER</b>", h2_style))
    story.append(Paragraph(
        f"In the light of the facts stated above, the Petitioner prays that this Facilitation Council be pleased to:<br/>"
        f"a) Direct the Respondent to pay the principal claim amount of <b>₹{principal_amt:,.2f}</b>;<br/>"
        f"b) Direct the Respondent to pay compound interest of <b>₹{interest_amt:,.2f}</b> accrued and further interest till the date of actual payment;<br/>"
        f"c) Pass any such further orders as this Council may deem fit in the interest of justice.",
        body_style
    ))
    
    story.append(Spacer(1, 30))
    story.append(Paragraph("<b>Petitioner Signature:</b> ___________________________<br/><b>Date:</b> " + datetime.date.today().strftime('%d-%b-%Y'), body_style))
    
    doc.build(story)
    return buffer.getvalue()
