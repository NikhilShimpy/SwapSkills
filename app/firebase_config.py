import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, storage

load_dotenv()  # load environment variables

# Replace escaped \n with real newlines
private_key = os.environ.get("FIREBASE_PRIVATE_KEY")
if private_key:
    private_key = private_key.replace("\\n", "\n")

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    "private_key": private_key,
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL")
})

firebase_admin.initialize_app(cred, {
    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET")
})

db = firestore.client()
bucket = storage.bucket()
