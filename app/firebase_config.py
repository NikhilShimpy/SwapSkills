import firebase_admin
from firebase_admin import credentials, firestore, storage

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("app/serviceAccountKey.json")  # ✅ Fix path
    firebase_admin.initialize_app(cred, {
    'storageBucket': 'skillswap-21922.appspot.com'  # ✅ Correct
})

# Firestore DB
db = firestore.client()

# Firebase Storage Bucket
bucket = storage.bucket()  # Works now because bucket name is set above
