import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from dotenv import load_dotenv
import os
import io
from PIL import Image
import numpy as np
import streamlit as st

load_dotenv()

# Email credentials
EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def sendEmail(recipient_email, user, response):
    try:
        # Set up the server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        # print("sever done")
        # Create the email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = recipient_email
        msg['Subject'] = "Your Requested Data from Pillai"
        # print("mail done")
        # Email body
        body = f"Hi {user} \n  {response}"
        msg.attach(MIMEText(body, 'plain'))
        # print("mail body done")
        
        # Send the email
        server.send_message(msg)
        # print('mail sent')
        server.quit()

        # print(f"Test email sent to {recipient_email}.")
    except Exception as e:
        print(f"Failed to send email. Error: {e}")

# if __name__ == "__main__":
#     # Prompt for recipient email
#     recipient_email = input("Enter the recipient email address: ")
#     send_test_email(recipient_email)
