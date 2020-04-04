def rgb_to_hsv(r, g, b):
    maxc = max(r, g, b)
    minc = min(r, g, b)
    v = maxc
    if minc == maxc:
        return 0.0, 0.0, v
    s = (maxc-minc) / maxc
    rc = (maxc-r) / (maxc-minc)
    gc = (maxc-g) / (maxc-minc)
    bc = (maxc-b) / (maxc-minc)
    if r == maxc:
        h = bc-gc
    elif g == maxc:
        h = 2.0+rc-bc
    else:
        h = 4.0+gc-rc
    h = (h/6.0) % 1.0
    return h, s, v

def _rgb_to_hexvalue(r, g, b):
    """
    Convert an RGB value to the hex representation expected by tuya.

    Index '5' (DPS_INDEX_COLOUR) is assumed to be in the format:
    rrggbb0hhhssvv

    While r, g and b are just hexadecimal values of the corresponding
    Red, Green and Blue values, the h, s and v values (which are values
    between 0 and 1) are scaled to 360 (h) and 255 (s and v) respectively.

    Args:
        r(int): Value for the colour red as int from 0-255.
        g(int): Value for the colour green as int from 0-255.
        b(int): Value for the colour blue as int from 0-255.
    """
    rgb = [r, g, b]
    hsv = rgb_to_hsv(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)

    hexvalue = ""
    for value in rgb:
        temp = str(hex(int(value))).replace("0x", "")
        if len(temp) == 1:
            temp = "0" + temp
        hexvalue = hexvalue + temp

    hsvarray = [int(hsv[0] * 360), int(hsv[1] * 255), int(hsv[2] * 255)]
    print("hsv: ", hsvarray)
    hexvalue_hsv = ""
    for value in hsvarray:
        temp = str(hex(int(value))).replace("0x", "")
        if len(temp) == 1:
            temp = "0" + temp
        hexvalue_hsv = hexvalue_hsv + temp
    if len(hexvalue_hsv) == 7:
        hexvalue = hexvalue + "0" + hexvalue_hsv
    else:
        hexvalue = hexvalue + "00" + hexvalue_hsv

    return hexvalue

print(_rgb_to_hexvalue(255,0,0))