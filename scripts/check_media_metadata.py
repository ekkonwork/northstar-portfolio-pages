"""Reject hidden provenance and appended payloads in public raster assets."""
import argparse
import io
from pathlib import Path
import struct
import zlib
from PIL import Image
from raster_container import inspect_jpeg, inspect_gif

HARMLESS={'loop','duration','background','transparency','jfif','jfif_version',
          'jfif_unit','jfif_density','progressive','progression'}


def check(data):
    with Image.open(io.BytesIO(data)) as image:
        harmless=HARMLESS|({'version','extension'} if image.format=='GIF' else set())
        if set(image.info)-harmless:raise ValueError('image metadata present')
        image.verify()
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        pos=8;ended=False
        while pos+12<=len(data):
            size=struct.unpack('>I',data[pos:pos+4])[0];end=pos+size+12
            if end>len(data):raise ValueError('truncated PNG')
            kind=data[pos+4:pos+8];payload=data[pos+8:end-4]
            if kind not in {b'IHDR',b'PLTE',b'IDAT',b'IEND',b'tRNS'}:raise ValueError('ancillary PNG chunk present')
            if zlib.crc32(kind+payload)&0xffffffff!=struct.unpack('>I',data[end-4:end])[0]:raise ValueError('invalid PNG checksum')
            pos=end
            if kind==b'IEND':ended=True;break
        if not ended or pos!=len(data):raise ValueError('invalid PNG ending')
    elif data[:4]==b'RIFF' and data[8:12]==b'WEBP':
        end=struct.unpack('<I',data[4:8])[0]+8;pos=12
        if end!=len(data):raise ValueError('invalid WebP ending')
        while pos+8<=end:
            kind=data[pos:pos+4];size=struct.unpack('<I',data[pos+4:pos+8])[0]
            if kind not in {b'VP8 ',b'VP8L',b'VP8X',b'ALPH',b'ANIM',b'ANMF'}:raise ValueError('ancillary WebP chunk present')
            pos+=8+size+(size&1)
        if pos!=end:raise ValueError('truncated WebP chunk')
    elif data.startswith(b'\xff\xd8') or data[:6] in {b'GIF87a',b'GIF89a'}:
        details=inspect_jpeg(data) if data.startswith(b'\xff\xd8') else inspect_gif(data)
        if details['extra_chunks'] or details['trailing_bytes']:
            raise ValueError('ancillary image block or trailing data present')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--assets',type=Path,default=Path(__file__).resolve().parents[1]/'assets')
    args=parser.parse_args();count=0;errors=[]
    for path in sorted(args.assets.rglob('*')):
        if path.suffix.lower() not in {'.png','.webp','.jpg','.jpeg','.gif'}:continue
        count+=1
        try:check(path.read_bytes())
        except Exception as error:errors.append(f'{path.relative_to(args.assets)}: {type(error).__name__}')
    if errors:raise SystemExit('\n'.join(errors))
    print(f'Metadata verified: {count} public raster assets.')


if __name__=='__main__':main()
