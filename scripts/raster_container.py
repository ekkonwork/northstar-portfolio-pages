"""Inspect JPEG/GIF container blocks without exposing their payload values."""
import struct


def inspect_jpeg(data):
    if not data.startswith(b'\xff\xd8'):
        raise ValueError('invalid JPEG signature')
    pos = 2
    extra = []
    while pos < len(data):
        if data[pos] != 255:
            raise ValueError('invalid JPEG marker')
        while pos < len(data) and data[pos] == 255:
            pos += 1
        if pos >= len(data):
            raise ValueError('truncated JPEG marker')
        kind = data[pos]
        pos += 1
        if kind == 0xd9:
            return {'extra_chunks': sorted(set(extra)), 'trailing_bytes': len(data) - pos}
        if kind == 0x01 or 0xd0 <= kind <= 0xd7:
            continue
        if kind in {0, 0xd8} or pos + 2 > len(data):
            raise ValueError('invalid JPEG segment')
        size = struct.unpack('>H', data[pos:pos+2])[0]
        end = pos + size
        if size < 2 or end > len(data):
            raise ValueError('truncated JPEG segment')
        payload = data[pos+2:end]
        if kind == 0xfe:
            extra.append('COM')
        elif 0xe0 <= kind <= 0xef:
            standard_jfif = (kind == 0xe0 and len(payload) == 14
                             and payload[:5] == b'JFIF\0' and payload[-2:] == b'\0\0')
            standard_adobe = kind == 0xee and len(payload) == 12 and payload[:5] == b'Adobe'
            if not (standard_jfif or standard_adobe):
                extra.append(f'APP{kind - 0xe0}')
        pos = end
        if kind == 0xda:
            # Scan entropy bytes, respecting byte stuffing and restart markers.
            while True:
                marker = data.find(b'\xff', pos)
                if marker < 0:
                    raise ValueError('missing JPEG ending')
                next_byte = marker + 1
                while next_byte < len(data) and data[next_byte] == 255:
                    next_byte += 1
                if next_byte >= len(data):
                    raise ValueError('truncated JPEG scan')
                code = data[next_byte]
                if code == 0 or 0xd0 <= code <= 0xd7:
                    pos = next_byte + 1
                else:
                    pos = marker
                    break
    raise ValueError('missing JPEG ending')


def inspect_gif(data):
    if data[:6] not in {b'GIF87a', b'GIF89a'} or len(data) < 13:
        raise ValueError('invalid GIF signature')
    pos = 13
    extra = []
    if data[10] & 128:
        pos += 3 * (1 << ((data[10] & 7) + 1))

    def blocks(offset):
        chunks = []
        while offset < len(data):
            size = data[offset]
            offset += 1
            if size == 0:
                return chunks, offset
            if offset + size > len(data):
                raise ValueError('truncated GIF block')
            chunks.append(data[offset:offset+size])
            offset += size
        raise ValueError('missing GIF block ending')

    while pos < len(data):
        kind = data[pos]
        pos += 1
        if kind == 0x3b:
            return {'extra_chunks': sorted(set(extra)), 'trailing_bytes': len(data) - pos}
        if kind == 0x2c:
            if pos + 9 > len(data):
                raise ValueError('truncated GIF image')
            packed = data[pos+8]
            pos += 9
            if packed & 128:
                pos += 3 * (1 << ((packed & 7) + 1))
            if pos >= len(data):
                raise ValueError('missing GIF image data')
            _, pos = blocks(pos + 1)
        elif kind == 0x21:
            if pos >= len(data):
                raise ValueError('truncated GIF extension')
            label = data[pos]
            chunks, pos = blocks(pos + 1)
            control = label == 0xf9 and len(chunks) == 1 and len(chunks[0]) == 4
            loop = (label == 0xff and len(chunks) == 2 and chunks[0] == b'NETSCAPE2.0'
                    and len(chunks[1]) == 3 and chunks[1][0] == 1)
            if not (control or loop):
                extra.append(f'extension_{label:02x}')
        else:
            raise ValueError('invalid GIF block')
    raise ValueError('missing GIF ending')
