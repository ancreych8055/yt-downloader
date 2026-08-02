import sys
import json
import struct
import subprocess

def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    json_message = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('@I', len(json_message)))
    sys.stdout.buffer.write(json_message)
    sys.stdout.buffer.flush()

def main():
    message = get_message()
    if not message:
        return

    video_url = message.get('video_url')
    if not video_url:
        send_message({"status": "error", "message": "No URL"})
        return

    command = [
        "yt-dlp",
        "-x", "--audio-format", "mp3", "--audio-quality", "0",
        "-P", "D:\\хлам\\yt-audio",
        "--playlist-items", "1",
        video_url
    ]

    try:
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            send_message({"status": "success", "output": "Done"})
        else:
            send_message({"status": "error", "output": result.stderr})
    except Exception as e:
        send_message({"status": "error", "message": str(e)})

    sys.stdout.flush()
    
if __name__ == "__main__":
    main()