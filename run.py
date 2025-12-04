from app import create_app, socketio

app = create_app()

if __name__ == "__main__":
    # Use socketio.run() for proper SocketIO server
    socketio.run(app, debug=True)
