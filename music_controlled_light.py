import pyaudio  # Soundcard audio I/O access library
import numpy as np
import asyncio
import websockets
from time import perf_counter
import colorsys
from scipy.signal import spectrogram


def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % rgb

def int_to_hex(nr):
  h = format(int(nr), 'x')
  return '0' + h if len(h) % 2 else h

def calculate_hls(cur_segment,fs,nperseg):
    f, t, Sxx = spectrogram(cur_segment, fs=fs, nperseg=nperseg)
    calculated_hue = HI_LIMIT - np.argmax(Sxx) if HI_LIMIT - np.argmax(Sxx) > 0 else 0
    rms = np.mean(np.abs(cur_segment))

    alpha = rms / 8 if rms / 8 < 1000 else 1000
    # print(alpha)

    hue_hex = int_to_hex(calculated_hue).zfill(3)
    light_hex = int_to_hex(alpha).zfill(4)
    saturation_hex = int_to_hex(1000).zfill(3)
    message = hue_hex + "0" + saturation_hex  + light_hex

    return message

async def send_color(websocket, path):
    print("sending data...")
    while True:
        send_str = read_audio()
        # await asyncio.sleep(UPDATE)
        if "-" not in send_str:
            await websocket.send(send_str)


def read_audio():
    data = stream.read(CHUNK)
    wav_chunk = np.frombuffer(data, dtype=np.int16)
    message = calculate_hls(wav_chunk, RATE, CHUNK)
    return message


# Setup channel info
FORMAT = pyaudio.paInt16  # data type formate
CHANNELS = 1  # Adjust to your number of channels
RATE = 44100  # Sample Rate
UPDATE = 50/1000
CHUNK = 1024 # Block Size
HI_LIMIT = 50

# Startup pyaudio instance
audio = pyaudio.PyAudio()

# start Recording
stream = audio.open(format=FORMAT, channels=CHANNELS,
                    rate=RATE, input=True,
                    frames_per_buffer=CHUNK)
hue_hex = ""

start_server = websockets.serve(send_color, "localhost", 5000)
# start_server = websockets.serve(timing, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
