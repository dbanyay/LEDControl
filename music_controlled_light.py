import pyaudio  # Soundcard audio I/O access library
import numpy as np
import asyncio
import websockets
from time import perf_counter
import colorsys
from scipy.signal import spectrogram
from matplotlib import pyplot as plt

def int_to_hex(nr):
  h = format(int(nr), 'x')
  return '0' + h if len(h) % 2 else h

def calculate_hls(cur_segment,fs,nperseg):
    f, t, Sxx = spectrogram(cur_segment, fs=fs, nperseg=nperseg)
    calculated_hue = logarithmic_mapping(Sxx,f)

    rms = np.mean(np.abs(cur_segment))
    alpha = rms / 8 if rms / 8 < 1000 else 1000

    hue_hex = int_to_hex(calculated_hue).zfill(4)

    print(f"hue: {calculated_hue}, hue hex: {hue_hex} alpha: {alpha}")


    light_hex = int_to_hex(alpha).zfill(4)
    saturation_hex = int_to_hex(1000).zfill(4)
    message = hue_hex + saturation_hex  + light_hex

    print(f'message: {message}')


    return message

def logarithmic_mapping(Sxx,f):
    dominant_freq = f[np.argmax(Sxx)]
    log_f = np.logspace(start=np.log10(40), stop=np.log10(RATE/2), num=NUM_COLORS)
    log_hue = closest_freq(log_f,dominant_freq)
    return NUM_COLORS - log_hue


def closest_freq(freq_array, K):
    idx = (np.abs(freq_array - K)).argmin()
    return idx

async def send_color(websocket, path):
    print("sending data...")
    while True:
        send_str = read_audio()
        if "-" not in send_str:
            await websocket.send(send_str)


def read_audio():
    data = stream.read(CHUNK)
    wav_chunk = np.frombuffer(data, dtype=np.int16)
    message = calculate_hls(wav_chunk, RATE, CHUNK)
    return message


# Setup channel info
FORMAT = pyaudio.paInt16  # data type format
CHANNELS = 1  # Adjust to your number of channels
RATE = 16000 # Sample Rate
CHUNK = 256 # Block Size
NUM_COLORS =  150 # range from 0 to NUM_COLORS

# Startup pyaudio instance
audio = pyaudio.PyAudio()

# start Recording
stream = audio.open(format=FORMAT, channels=CHANNELS,
                    rate=RATE, input=True,
                    frames_per_buffer=CHUNK)

print(f"latency: {stream.get_input_latency()}")

hue_hex = ""

start_server = websockets.serve(send_color, "localhost", 5000)
# start_server = websockets.serve(timing, "localhost", 5000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
