from app import create_app, socketio

app, socketio = create_app()   # unpack both

if __name__ == "__main__":
    socketio.run(app, debug=True)
