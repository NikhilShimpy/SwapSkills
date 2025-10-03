from app import create_app

app = create_app()   # Flask app must be exposed as `app`

if __name__ == "__main__":
    app.run()

